import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDataService } from '../../services/data/loan.data.service';
import { LoanReadDto, LoanUpdateDto } from '../../models/dtos/loan.dtos';

@Component({
  selector: 'app-overdue-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overdue-users.component.html',
  styleUrl: './overdue-users.component.css'
})
export class OverdueUsersComponent implements OnInit {
  loans: LoanReadDto[] = [];
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Tracks which loan IDs are being processed or animating out
  processingIds = new Set<number>();
  removingIds   = new Set<number>();

  displayCount = 0;

  constructor(private loanService: LoanDataService) {}

  ngOnInit(): void {
    this.loanService.getItems().subscribe({
      next: (data: LoanReadDto[]) => {
        this.loans = data.filter((loan: LoanReadDto) => loan.status === 'overdue');
        this.loading = false;
        setTimeout(() => this.animateCount(this.loans.length, 900), 100);
      },
      error: (err: unknown) => {
        console.error('Error loading overdue loans:', err);
        this.error = 'Failed to load overdue users.';
        this.loading = false;
      }
    });
  }

  private animateCount(target: number, duration: number): void {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayCount = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  daysOverdue(dueDate: Date): number {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.max(0, Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  }

  markReturned(loan: LoanReadDto): void {
    if (this.processingIds.has(loan.id)) return;

    this.processingIds.add(loan.id);

    const updateDto: LoanUpdateDto = {
      id: loan.id,
      issueDate: loan.issueDate,
      dueDate: loan.dueDate,
      status: 'returned',
      bookRelations: loan.bookRelations
    };

    this.loanService.updateItem(updateDto).subscribe({
      next: (success: boolean) => {
        this.processingIds.delete(loan.id);
        if (success) {
          // Trigger exit animation, then remove from list
          this.removingIds.add(loan.id);
          setTimeout(() => {
            this.loans = this.loans.filter(l => l.id !== loan.id);
            this.removingIds.delete(loan.id);
            this.displayCount = this.loans.length;
            this.showToast(`Loan #${loan.id} marked as returned.`);
          }, 380);
        }
      },
      error: (err: unknown) => {
        console.error('Error updating loan:', err);
        this.processingIds.delete(loan.id);
        this.showToast('Failed to update loan. Please try again.', true);
      }
    });
  }

  isProcessing(id: number): boolean { return this.processingIds.has(id); }
  isRemoving(id: number):   boolean { return this.removingIds.has(id); }

  private showToast(message: string, isError = false): void {
    this.successMessage = (isError ? 'error:' : '') + message;
    setTimeout(() => { this.successMessage = null; }, 3500);
  }

  get toastMessage(): string | null {
    return this.successMessage?.replace(/^error:/, '') ?? null;
  }

  get isErrorToast(): boolean {
    return this.successMessage?.startsWith('error:') ?? false;
  }
}
