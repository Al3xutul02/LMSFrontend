import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDataService } from '../../../core/services/data/loan.data.service';
import { LoanReadDto, LoanUpdateDto } from '../../../core/models/dtos/loan.dtos';

@Component({
  selector: 'app-books-to-return',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-to-return.component.html',
  styleUrls: ['./books-to-return.component.css']
})
export class BooksToReturnComponent implements OnInit {
  private loanService = inject(LoanDataService);
  activeLoans: LoanReadDto[] = [];
  processingIds = new Set<number>();

  ngOnInit(): void {
    this.loadActiveLoans();
  }

  loadActiveLoans(): void {
    this.loanService.getActiveLoans().subscribe({
      next: (data) => this.activeLoans = data,
      error: (err) => console.error('Eroare la încărcarea împrumuturilor:', err)
    });
  }

  markAsReturned(loanId: number): void {
    if (this.processingIds.has(loanId)) return;

    const loan = this.activeLoans.find(l => l.id === loanId);
    if (!loan) return;

    this.processingIds.add(loanId);

    const updateDto: LoanUpdateDto = {
      id: loan.id,
      issueDate: loan.issueDate,
      dueDate: loan.dueDate,
      status: 'returned',
      bookRelations: loan.bookRelations
    };

    this.loanService.updateItem(updateDto).subscribe({
      next: (success: boolean) => {
        this.processingIds.delete(loanId);
        if (success) {
          this.activeLoans = this.activeLoans.filter(l => l.id !== loanId);
          console.log(`Loan #${loanId} marked as returned successfully`);
        }
      },
      error: (err) => {
        this.processingIds.delete(loanId);
        console.error('Failed to mark loan as returned:', err);
      }
    });
  }
}