import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanDataService } from '../../services/data/loan.data.service';
import { BookReadDto, BookRelationDto } from '../../models/dtos/book.dtos';
import { ActivatedRoute } from '@angular/router';
import { BookDataService } from '../../services/data/book.data.service';
import { LoanCreateDto } from '../../models/dtos/loan.dtos';
import { AuthService } from '../../services/auth.service';
import { AssetService } from '../../services/asset.service';

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
  assetService = inject(AssetService);
  route = inject(ActivatedRoute);
  @Output() closed = new EventEmitter<void>();
  
  book!: BookReadDto;
  imagePath!: string;
  pickupDate: string = '';
  bookCount: number = 1;

  async ngOnInit() {
    this.book = history.state.book;
    const normalizedFileName = decodeURIComponent(this.book.imagePath).replace(/ /g, '_');
    this.imagePath = this.assetService.getImagePath('books', normalizedFileName);

    if (!this.book) {
      const isbn: number = Number(this.route.snapshot.paramMap.get('isbn')!);
      this.bookService.getItemById(isbn).subscribe({
        next: (book) => {
          this.book = book;
          const normalizedFileName = decodeURIComponent(this.book.imagePath).replace(/ /g, '_');
          this.imagePath = this.assetService.getImagePath('books', normalizedFileName);
        }
      });
    }
  }

  confirmReservation() {
    if (!this.pickupDate) {
      alert('Te rugăm să selectezi o dată de ridicare!');
      return;
    }

    if (this.bookCount < 1 || this.bookCount > this.book.count) {
      alert(`Te rugăm să selectezi un număr valid de exemplare (1 - ${this.book.count})!`);
      return;
    }


    const currentUserId = this.authService.getUserId();
    const loanDto: LoanCreateDto = {
      loanerName: this.authService.getUserName(),
      bookRelations: [{ isbn: this.book.isbn, count: this.bookCount }]
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