import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDataService } from '../../../core/services/data/loan.data.service';
import { LoanReadDto } from '../../../core/models/dtos/loan.dtos';

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
    // Aici vei apela metoda de PUT/DELETE de pe backend pentru a finaliza împrumutul
    console.log('Returnare pentru loan ID:', loanId);
  }
}