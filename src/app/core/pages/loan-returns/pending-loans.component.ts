import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDataService } from '../../services/data/loan.data.service';
import { LoanReadDto, LoanUpdateDto } from '../../models/dtos/loan.dtos';

@Component({
  selector: 'app-pending-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-loans.component.html',
  styleUrl: './pending-loans.component.css'
})
export class PendingLoansComponent implements OnInit {
  loans: LoanReadDto[] = [];
  loading = true;
  error: string | null = null;

  constructor(private loanService: LoanDataService) {}

  ngOnInit(): void {
    this.loanService.getAll().subscribe({
      next: (data: LoanReadDto[]) => {
        // Filter for pending loans only
        this.loans = data.filter((loan: LoanReadDto) => loan.status === 'pending');
        console.log('Pending loans filtered:', this.loans);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading loans:', err);
        this.error = 'Failed to load pending loans.';
        this.loading = false;
      }
    });
  }

  approve(id: number): void {
    const loan = this.loans.find(l => l.id === id);
    if (!loan) return;

    const updateDto: LoanUpdateDto = {
      id: loan.id,
      issueDate: loan.issueDate,
      dueDate: loan.dueDate,
      status: 'active',
      bookRelations: loan.bookRelations
    };

    this.loanService.update(updateDto).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.loans = this.loans.filter(l => l.id !== id);
        }
      },
      error: (err) => console.error('Error approving loan:', err)
    });
  }

  reject(id: number): void {
    this.loanService.delete(id).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.loans = this.loans.filter(l => l.id !== id);
        }
      },
      error: (err) => console.error('Error rejecting loan:', err)
    });
  }
}
