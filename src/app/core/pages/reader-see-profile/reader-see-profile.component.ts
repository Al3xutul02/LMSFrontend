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
  isbn: number;
  genres: any[];
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

  public hoveredBook: BookReadDto | null = null;
  popoverPos = { x: 0, y: 0 };
  private hoverTimer: Subscription | null = null;

  private readonly GENRE_NAME_TO_INT: Record<string, number> = {
    'action': 0,
    'adventure': 1,
    'artandphotography': 2,
    'biography': 3,
    'children': 4,
    'comingofage': 5,
    'contemporaryfiction': 6,
    'cookbooks': 7,
    'dystopian': 8,
    'fantasy': 9,
    'graphicnovel': 10,
    'guideorhowto': 11,
    'historicalfiction': 12,
    'history': 13,
    'horror': 14,
    'humanitiesandsocialsciences': 15,
    'humor': 16,
    'memoir': 17,
    'mystery': 18,
    'parentingandfamilies': 19,
    'philosophy': 20,
    'religionandspirituality': 21,
    'romance': 22,
    'scienceandtechnology': 23,
    'sciencefiction': 24,
    'selfhelp': 25,
    'shortstory': 26,
    'thriller': 27,
    'travel': 28,
    'truecrime': 29,
    'youngadult': 30
  };

  private genreToInt(g: any): number | null {
    if (typeof g === 'number') return g;
    if (typeof g === 'string') {
      const asNum = parseInt(g, 10);
      if (!isNaN(asNum)) return asNum;
      const normalized = g.replace(/-/g, '').toLowerCase();
      const mapped = this.GENRE_NAME_TO_INT[normalized];
      return mapped !== undefined ? mapped : null;
    }
    return null;
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.userDataService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loadBorrowingData(userId);
        // Nu apela loadRecommendations() aici — se apelează din loadBorrowingData
      },
      error: (err) => console.error('Eroare la încărcarea profilului:', err)
    });
  }

  ngOnDestroy(): void {
    this.hoverTimer?.unsubscribe();
  }

  onMouseEnter(book: BookReadDto | undefined): void {
    this.hoverTimer?.unsubscribe();
    if (book) {
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

        if (loans.length === 0) {
          this.loadRecommendations([]);
          return of([]);
        }

        const entries$ = loans.flatMap(loan =>
          (loan.bookRelations ?? []).map(br =>
            this.bookService.getDetails(br.isbn).pipe(
              catchError(() => of(null)),
              switchMap((book: BookReadDto | null) => of({
                dueDate: loan.dueDate,
                title: book?.title ?? `ISBN: ${br.isbn}`,
                author: book?.author ?? 'Autor necunoscut',
                isbn: br.isbn,
                genres: book?.genres ?? [],
                fullDetails: book ?? undefined
              } as LoanBookEntry))
            )
          )
        );

        return entries$.length > 0 ? forkJoin(entries$) : of([]);
      })
    ).subscribe({
      next: (entries) => {
        this.loanBookEntries = entries as LoanBookEntry[];

        const genreSet = new Set<number>();
        this.loanBookEntries.forEach(entry =>
          (entry.genres ?? []).forEach((g: any) => {
            const val = this.genreToInt(g);
            if (val !== null) genreSet.add(val);
          })
        );

        this.loadRecommendations(Array.from(genreSet));
      },
      error: (err) => console.error('Eroare pipeline:', err)
    });
  }

  loadRecommendations(genres: number[] = []): void {
    const source$ = genres.length > 0
      ? this.bookService.getByGenres(genres)
      : this.bookService.searchBooks(null, null, null);

    source$.subscribe({
      next: (books) => {
        const borrowedIsbns = new Set(this.loanBookEntries.map(e => e.isbn));
        this.recommendations = books
          .filter(b => !borrowedIsbns.has(b.isbn))
          .slice(0, 4);
      },
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
    // Adaugă logica de navigare
  }
}