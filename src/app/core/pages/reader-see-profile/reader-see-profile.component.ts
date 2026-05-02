import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from "@angular/common";
import { forkJoin, of, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UserDataService } from '../../../core/services/data/user.data.service';
import { UserReadDto } from '../../../core/models/dtos/user.dtos';
import { AuthService } from '../../services/auth.service';
import { LoanDataService } from '../../../core/services/data/loan.data.service';
import { BookDataService } from '../../../core/services/data/book.data.service';
import { LoanReadDto } from '../../../core/models/dtos/loan.dtos';
import { BookReadDto } from '../../../core/models/dtos/book.dtos';
import { BookDetailsComponent } from '../book-details/book-details.component';

export interface LoanBookEntry {
  dueDate: Date;
  title: string;
  author: string;
  fullDetails?: BookReadDto;
}

@Component({
  selector: 'app-reader-see-profile',
  standalone: true,
  imports: [CommonModule, BookDetailsComponent],
  templateUrl: './reader-see-profile.component.html',
  styleUrls: ['./reader-see-profile.component.scss']
})
export class ReaderSeeProfileComponent implements OnInit, OnDestroy {
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
  private loanService = inject(LoanDataService);
  private bookService = inject(BookDataService);

  userProfile?: UserReadDto;
  borrowedCount: number = 0;
  returnList: LoanReadDto[] = [];
  loanBookEntries: LoanBookEntry[] = []; 
  recommendations: any[] = [];
  isFavorite: boolean = false;
  
  // Variabile tracking hover
  public hoveredBook: BookReadDto | null = null;
  popoverPos = { x: 0, y: 0 };
  private hoverTimer: Subscription | null = null;

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.userDataService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loadBorrowingData(userId);
        this.loadRecommendations();
      },
      error: (err) => console.error('Eroare la încărcarea profilului:', err)
    });
  }

  // Curățăm timer-ul când componenta este distrusă pentru a evita memory leaks
  ngOnDestroy(): void {
    this.hoverTimer?.unsubscribe();
  }

  onMouseEnter(book: BookReadDto | undefined): void {
    // Resetăm timer-ul existent dacă mouse-ul se mișcă rapid între elemente
    this.hoverTimer?.unsubscribe();

    if (book) {
      // Setăm întârzierea la 1000ms (1 secundă) conform cerinței tale anterioare
      this.hoverTimer = timer(900).subscribe(() => {
        this.hoveredBook = book;
      });
    }
  }

  onMouseLeave(): void {
    this.hoverTimer?.unsubscribe();
    this.hoveredBook = null;
  }

  onMouseMove(event: MouseEvent): void {
    // Actualizăm poziția popover-ului constant
    this.popoverPos = { 
      x: event.clientX + 20, 
      y: event.clientY + 20 
    };
  }

  loadBorrowingData(userId: number): void {
    this.loanService.getUserLoans(userId).pipe(
      switchMap((loans: LoanReadDto[]) => {
        this.returnList = loans;
        this.borrowedCount = loans.reduce((acc, loan) => 
          acc + (loan.bookRelations?.reduce((s, br) => s + br.count, 0) ?? 0), 0);

        if (loans.length === 0) return of([]);

        const entries$ = loans.flatMap(loan =>
          (loan.bookRelations ?? []).map(br => 
            this.bookService.getDetails(br.isbn).pipe(
              catchError(() => of(null)),
              switchMap((book: BookReadDto | null) => of({
                dueDate: loan.dueDate,
                title: book?.title ?? `ISBN: ${br.isbn}`,
                author: book?.author ?? 'Autor necunoscut',
                fullDetails: book ?? undefined 
              } as LoanBookEntry))
            )
          )
        );
        return entries$.length > 0 ? forkJoin(entries$) : of([]);
      })
    ).subscribe({
      next: (entries) => this.loanBookEntries = entries as LoanBookEntry[],
      error: (err) => console.error('Eroare pipeline:', err)
    });
  }

  loadRecommendations(): void {
    this.bookService.searchBooks(null, null, null).subscribe({
      next: (books) => this.recommendations = books.slice(0, 2),
      error: (err) => console.error('Eroare recomandări:', err)
    });
  }

  isOverdue(date: string | Date): boolean {
    return new Date() > new Date(date);
  }

  toggleFavoriteGenre(): void { 
    this.isFavorite = !this.isFavorite; 
  }

  navigateToCatalog(): void {
    // Aici adaugi logica de navigare
  }
}