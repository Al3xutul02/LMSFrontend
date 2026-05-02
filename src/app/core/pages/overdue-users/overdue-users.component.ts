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

  // Animated counter
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
    const diff = today.getTime() - due.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  markReturned(loan: LoanReadDto): void {
    const updateDto: LoanUpdateDto = {
      id: loan.id,
      issueDate: loan.issueDate,
      dueDate: loan.dueDate,
      status: 'returned',
      bookRelations: loan.bookRelations
    };

    this.loanService.updateItem(updateDto).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.loans = this.loans.filter(l => l.id !== loan.id);
          this.displayCount = this.loans.length;
        }
      },
      error: (err: unknown) => console.error('Error updating loan:', err)
    });
  }
}
