import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoanDataService } from '../../services/data/loan.data.service';
import { FineDataService } from '../../services/data/fine.data.service';
import { LoanReadDto, LoanUpdateDto } from '../../models/dtos/loan.dtos';
import { FineReadDto, FineCreateDto, FineUpdateDto } from '../../models/dtos/fine.dtos';

interface FineForm {
  amount: number;
  dirty: boolean;
}

@Component({
  selector: 'app-manage-returns',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-returns.component.html',
  styleUrl: './manage-returns.component.css'
})
export class ManageReturnsComponent implements OnInit {
  loans: LoanReadDto[] = [];
  fineMap = new Map<number, FineReadDto>(); // keyed by loanId

  loading = true;
  error: string | null = null;
  displayCount = 0;

  expandedIds       = new Set<number>();
  processingIds     = new Set<number>();
  fineProcessingIds = new Set<number>();
  removingIds       = new Set<number>();

  fineFormMap = new Map<number, FineForm>(); // keyed by loanId

  toastMsg: string | null = null;
  toastIsError = false;

  constructor(
    private loanService: LoanDataService,
    private fineService: FineDataService
  ) {}

  ngOnInit(): void {
    forkJoin({
      loans: this.loanService.getItems(),
      fines: this.fineService.getItems()
    }).subscribe({
      next: ({ loans, fines }) => {
        this.loans = loans.filter(l => l.status === 'overdue');
        fines.forEach(f => this.fineMap.set(f.loanId, f));
        this.loans.forEach(loan => this.initForm(loan));
        this.loading = false;
        setTimeout(() => this.animateCount(this.loans.length, 900), 100);
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || err?.error || JSON.stringify(err);
        this.error = `Error: ${msg}`;
        this.loading = false;
      }
    });
  }

  private initForm(loan: LoanReadDto): void {
    const fine = this.fineMap.get(loan.id);
    const days = this.daysOverdue(loan.dueDate);
    this.fineFormMap.set(loan.id, {
      amount: fine ? fine.amount : Math.max(1, Math.round(days * 0.5)),
      dirty: false
    });
  }

  getFine(loan: LoanReadDto): FineReadDto | undefined {
    return this.fineMap.get(loan.id);
  }

  getForm(loanId: number): FineForm {
    return this.fineFormMap.get(loanId) ?? { amount: 0, dirty: false };
  }

  daysOverdue(dueDate: Date): number {
    const due   = new Date(dueDate);
    const today = new Date();
    return Math.max(0, Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  }

  toggleExpand(id: number): void {
    this.expandedIds.has(id) ? this.expandedIds.delete(id) : this.expandedIds.add(id);
  }

  markFormDirty(loanId: number): void {
    const f = this.fineFormMap.get(loanId);
    if (f) f.dirty = true;
  }

  saveFine(loan: LoanReadDto): void {
    if (this.fineProcessingIds.has(loan.id)) return;
    const form = this.getForm(loan.id);
    if (!form.amount) {
      this.showToast('Please enter an amount.', true);
      return;
    }

    const existing = this.getFine(loan);
    this.fineProcessingIds.add(loan.id);

    if (existing) {
      const dto: FineUpdateDto = {
        id:     existing.id,
        loanId: loan.id,
        amount: form.amount,
        status: existing.status
      };
      this.fineService.updateItem(dto).subscribe({
        next: () => {
          existing.amount = form.amount;
          form.dirty = false;
          this.fineProcessingIds.delete(loan.id);
          this.showToast('Fine updated.');
        },
        error: () => {
          this.fineProcessingIds.delete(loan.id);
          this.showToast('Failed to update fine.', true);
        }
      });
    } else {
      const dto: FineCreateDto = {
        loanId: loan.id,
        amount: form.amount
      };
      this.fineService.addItem(dto).subscribe({
        next: () => {
          this.fineService.getItems().subscribe(fines => {
            fines.forEach(f => this.fineMap.set(f.loanId, f));
            form.dirty = false;
            this.fineProcessingIds.delete(loan.id);
            this.showToast('Fine created.');
          });
        },
        error: () => {
          this.fineProcessingIds.delete(loan.id);
          this.showToast('Failed to create fine.', true);
        }
      });
    }
  }

  updateFineStatus(loan: LoanReadDto, status: 'paid' | 'waived'): void {
    const fine = this.getFine(loan);
    if (!fine || this.fineProcessingIds.has(loan.id)) return;
    this.fineProcessingIds.add(loan.id);

    const dto: FineUpdateDto = {
      id:     fine.id,
      loanId: fine.loanId,
      amount: fine.amount,
      status
    };

    this.fineService.updateItem(dto).subscribe({
      next: () => {
        fine.status = status;
        this.fineProcessingIds.delete(loan.id);
        this.showToast(`Fine marked as ${status}.`);
      },
      error: () => {
        this.fineProcessingIds.delete(loan.id);
        this.showToast(`Failed to mark fine as ${status}.`, true);
      }
    });
  }

  markReturned(loan: LoanReadDto): void {
    if (this.processingIds.has(loan.id)) return;
    this.processingIds.add(loan.id);

    const dto: LoanUpdateDto = {
      id:            loan.id,
      issueDate:     loan.issueDate,
      dueDate:       loan.dueDate,
      status:        'returned',
      bookRelations: loan.bookRelations
    };

    this.loanService.updateItem(dto).subscribe({
      next: (success: boolean) => {
        this.processingIds.delete(loan.id);
        if (success) {
          this.removingIds.add(loan.id);
          setTimeout(() => {
            this.loans = this.loans.filter(l => l.id !== loan.id);
            this.removingIds.delete(loan.id);
            this.displayCount = this.loans.length;
            this.showToast(`Loan #${loan.id} marked as returned.`);
          }, 380);
        }
      },
      error: () => {
        this.processingIds.delete(loan.id);
        this.showToast('Failed to process return. Please try again.', true);
      }
    });
  }

  isExpanded(id: number):      boolean { return this.expandedIds.has(id); }
  isProcessing(id: number):    boolean { return this.processingIds.has(id); }
  isRemoving(id: number):      boolean { return this.removingIds.has(id); }
  isFineProcessing(id: number):boolean { return this.fineProcessingIds.has(id); }

  private animateCount(target: number, duration: number): void {
    const start = performance.now();
    const tick  = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      this.displayCount = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private showToast(message: string, isError = false): void {
    this.toastMsg     = message;
    this.toastIsError = isError;
    setTimeout(() => { this.toastMsg = null; }, 3500);
  }
}
