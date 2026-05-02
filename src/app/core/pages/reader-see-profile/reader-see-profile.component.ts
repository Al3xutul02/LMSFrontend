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
  returnList: LoanReadDto[] = []; 
  recommendations: any[] = [];
  isFavorite: boolean = false;

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    
    // 1. Încărcăm profilul utilizatorului folosind ID-ul din sesiune
    this.userDataService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        // 2. Încărcăm datele de împrumut folosind același userId
        this.loadBorrowingData(userId);
        this.loadRecommendations();
      },
      error: (err: any) => console.error('Eroare la încărcarea profilului:', err)
    });
    console.log("ID din Token:", userId);
  }

 loadBorrowingData(userId: number) {
  this.loanService.getUserLoans(userId).subscribe({
    next: (loans: LoanReadDto[]) => {
      this.returnList = loans;
      
      // Calculăm suma tuturor cărților din toate împrumuturile
      this.borrowedCount = loans.reduce((acc, loan) => {
        // Presupunem că fiecare loan are o listă de relații cu cărțile
        const booksInLoan = loan.bookRelations ? loan.bookRelations.reduce((sum, br) => sum + br.count, 0) : 0;
        return acc + booksInLoan;
      }, 0);
    }
  });
}

  loadRecommendations() {
    this.bookService.searchBooks(null, null, null).subscribe({
      next: (books) => {
        this.recommendations = books.slice(0, 2);
      },
      error: (err: any) => console.error('Eroare la încărcarea recomandărilor:', err)
    });
  }

  isOverdue(date: string | Date): boolean {
    return new Date() > new Date(date);
  }

  toggleFavoriteGenre() {
    this.isFavorite = !this.isFavorite;
  }

  navigateToCatalog() {
  }
}