import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanDataService } from '../../services/data/loan.data.service';
import { BookReadDto, BookRelationDto } from '../../models/dtos/book.dtos';
import { ActivatedRoute } from '@angular/router';
import { BookDataService } from '../../services/data/book.data.service';
import { LoanCreateDto } from '../../models/dtos/loan.dtos';
import { AuthService } from '../../services/auth.service';
import { env } from '../../../../environment';

@Component({
  selector: 'reserve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.scss'
})
export class ReserveComponent implements OnInit {
  authService = inject(AuthService);
  loanService = inject(LoanDataService);
  bookService = inject(BookDataService);
  route = inject(ActivatedRoute);
  @Output() closed = new EventEmitter<void>();
  
  book!: BookReadDto;
  imagePath!: string;
  pickupDate: string = '';
  bookCount: number = 1;

  async ngOnInit() {
    this.book = history.state.book;
    const normalizedFileName = decodeURIComponent(this.book.imagePath).replace(/ /g, '_');
    this.imagePath = `${env.imagePaths['books']}/${normalizedFileName}`;

    if (!this.book) {
      const isbn: number = Number(this.route.snapshot.paramMap.get('isbn')!);
      this.bookService.getItemById(isbn).subscribe({
        next: (book) => {
          this.book = book;
          const normalizedFileName = decodeURIComponent(this.book.imagePath).replace(/ /g, '_');
          this.imagePath = `${env.imagePaths['books']}/${normalizedFileName}`;
        }
      });
    }
  }

  // This also has logic to handle multiple book reservations, but the UI only allows one for now.
  // This is to future-proof for the next feature with the user profile that also has a 'shopping cart'
  // type of reservation list.
  confirmReservation() {
    if (!this.pickupDate) {
      alert('Te rugăm să selectezi o dată de ridicare!');
      return;
    }

    if (this.bookCount < 1 || this.bookCount > this.book.count) {
      alert(`Te rugăm să selectezi un număr valid de exemplare (1 - ${this.book.count})!`);
      return;
    }

    var reservationList: Map<number, number> = new Map<number, number>();

    const stored = localStorage.getItem("reservationList");
    reservationList = stored !== null
                ? new Map<number, number>(JSON.parse(stored))
                : new Map<number, number>();
    reservationList.set(this.book.isbn, this.bookCount);
    localStorage.setItem("reservationList", JSON.stringify(Array.from(reservationList.values())));

    const currentUserId = this.authService.getUserId();

    const bookRelations: BookRelationDto[] = [];
    reservationList.forEach((count, isbn) => {
      bookRelations.push({ isbn, count });
    });

    const loanDto: LoanCreateDto = {
      loanerName: this.authService.getUserName(),
      bookRelations: bookRelations
    };

    this.loanService.reserve(loanDto, currentUserId, this.pickupDate).subscribe({
      next: () => {
        alert('Rezervare confirmată cu succes!');
        this.close();
      },
      error: (err: any) => {
        if (err.status === 401) {
          alert('Eroare: Nu ești autentificat sau ai amenzi ce trebuie plătite.');
        }
        else {
          alert('Eroare la procesarea rezervării. Te rugăm să încerci din nou mai târziu.');
        }
      }
    });
  }

  close() {
    this.closed.emit();
  }
}