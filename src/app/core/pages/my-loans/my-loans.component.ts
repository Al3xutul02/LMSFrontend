import { Component, OnInit, inject } from '@angular/core';
import { LoanDataService } from '../../services/data/loan.data.service';
import { LoanReadDto } from '../../models/dtos/loan.dtos';

import { CommonModule } from '@angular/common';  // add

@Component({
  standalone: true,           // add
  imports: [CommonModule],    // add
  selector: 'app-my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.css']
})
export class MyLoansComponent implements OnInit {
  private loanDataService = inject(LoanDataService);

  loans: LoanReadDto[] = [];
  loading = true;
  error = '';
  userId = 1; // replace with your auth service user ID

  ngOnInit(): void {
    this.loanDataService.getUserLoans(this.userId).subscribe({
      next: (data: LoanReadDto[]) => {
        this.loans = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load loans.';
        this.loading = false;
      }
    });
  }

  getDaysLeft(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
}