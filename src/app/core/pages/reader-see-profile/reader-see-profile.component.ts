import { Component, inject, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/data/user.data.service';
import { UserReadDto } from '../../../core/models/dtos/user.dtos';
import { CommonModule } from "@angular/common";
import { AuthService } from '../../services/auth.service';
import { LoanDataService } from '../../../core/services/data/loan.data.service';
import { BookDataService } from '../../../core/services/data/book.data.service';
import { LoanReadDto } from '../../../core/models/dtos/loan.dtos';

@Component({
  selector: 'app-reader-see-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reader-see-profile.component.html',
  styleUrls: ['./reader-see-profile.component.scss']
})
export class ReaderSeeProfileComponent implements OnInit {
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
  private loanService = inject(LoanDataService);
  private bookService = inject(BookDataService);

  userProfile?: UserReadDto;
  borrowedCount: number = 0;
  returnList: LoanReadDto[] = []; // Folosim DTO-ul real de Loan
  recommendations: any[] = [];
  isFavorite: boolean = false;

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    
    // 1. Încărcăm profilul utilizatorului
    this.userDataService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        // 2. După ce avem profilul, încărcăm datele specifice activității
        this.loadBorrowingData(userId);
        this.loadRecommendations();
      },
      error: (err) => console.error('Eroare la încărcarea profilului:', err)
    });
  }

  loadBorrowingData(userId: number) {
    // Apelăm metoda creată recent în backend pentru a lua împrumuturile reale
    this.loanService.getUserLoans(userId).subscribe({
      next: (loans) => {
        this.returnList = loans;
        // borrowedCount nu mai este 6, ci lungimea listei din baza de date
        this.borrowedCount = loans.length;
      },
      error: (err) => console.error('Eroare la încărcarea împrumuturilor:', err)
    });
  }

  loadRecommendations() {
    // Putem lua recomandări reale (ex: ultimele cărți adăugate în bibliotecă)
    this.bookService. searchBooks(null, null, null).subscribe({
      next: (books) => {
        // Luăm doar primele 2 pentru secțiunea de recomandări
        this.recommendations = books.slice(0, 2);
      },
      error: (err) => console.error('Eroare la încărcarea recomandărilor:', err)
    });
  }

  isOverdue(date: string | Date): boolean {
    return new Date() > new Date(date);
  }

  toggleFavoriteGenre() {
    this.isFavorite = !this.isFavorite;
  }

  navigateToCatalog() {
    // Aici poți adăuga navigarea reală: this.router.navigate(['/catalog']);
  }
}