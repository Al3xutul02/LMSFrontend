import { Component, inject, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/data/user.data.service';
import { UserReadDto } from '../../../core/models/dtos/user.dtos';
import { CommonModule } from "@angular/common";
import { AuthService } from '../../services/auth.service';
import { LoanDataService } from '../../../core/services/data/loan.data.service';
import { BookDataService } from '../../../core/services/data/book.data.service';
import { LoanReadDto } from '../../../core/models/dtos/loan.dtos';
import { BookReadDto } from '../../../core/models/dtos/book.dtos';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

// Model local pentru afișare
export interface LoanBookEntry {
  dueDate: Date;
  title: string;
  author: string;
}

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
  loanBookEntries: LoanBookEntry[] = []; // <-- NOU: lista îmbogățită pentru afișare
  recommendations: any[] = [];
  isFavorite: boolean = false;

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    this.userDataService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loadBorrowingData(userId);
        this.loadRecommendations();
      },
      error: (err: any) => console.error('Eroare la încărcarea profilului:', err)
    });
  }

  loadBorrowingData(userId: number) {
  this.loanService.getUserLoans(userId).pipe(
    switchMap((loans: LoanReadDto[]) => {
      console.log('Loans primite:', loans);
      console.log('BookRelations din primul loan:', loans[0]?.bookRelations);
      
      this.returnList = loans;
      this.borrowedCount = loans.reduce((acc, loan) => {
        return acc + (loan.bookRelations?.reduce((s, br) => s + br.count, 0) ?? 0);
      }, 0);

      if (loans.length === 0) return of([]);

      const entries$ = loans.flatMap(loan =>
        (loan.bookRelations ?? []).map(br => {
          console.log('Fetch pentru ISBN:', br.isbn);
          return this.bookService.getDetails(br.isbn).pipe(
            catchError((err) => {
              console.error('Eroare getDetails pentru ISBN', br.isbn, err);
              return of(null);
            }),
            switchMap((book: BookReadDto | null) => {
              console.log('Book primit pentru ISBN', br.isbn, ':', book);
              return of({
                dueDate: loan.dueDate,
                title: book?.title ?? `ISBN: ${br.isbn}`,
                author: book?.author ?? 'Autor necunoscut'
              } as LoanBookEntry);
            })
          );
        })
      );

      console.log('Număr entries$:', entries$.length);
      return entries$.length > 0 ? forkJoin(entries$) : of([]);
    })
  ).subscribe({
    next: (entries) => {
      console.log('Entries finale:', entries);
      this.loanBookEntries = entries as LoanBookEntry[];
    },
    error: (err) => console.error('Eroare pipeline:', err)
  });
}

  loadRecommendations() {
    this.bookService.searchBooks(null, null, null).subscribe({
      next: (books) => {
        this.recommendations = books.slice(0, 2);
      },
      error: (err: any) => console.error('Eroare la recomandări:', err)
    });
  }

  isOverdue(date: string | Date): boolean {
    return new Date() > new Date(date);
  }

  toggleFavoriteGenre() {
    this.isFavorite = !this.isFavorite;
  }

  navigateToCatalog() {}
}