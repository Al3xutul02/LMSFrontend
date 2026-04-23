import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanDataService } from '../../services/data/loan.data.service';
import { BookReadDto, BookRelationDto } from '../../models/dtos/book.dtos';

@Component({
  selector: 'reserve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.scss'
})
export class ReserveComponent {
  @Input() book!: BookReadDto;
  @Output() closed = new EventEmitter<void>();
  
  pickupDate: string = '';

  constructor(private loanService: LoanDataService) {}

  confirmReservation() {
    if (!this.pickupDate) {
      alert('Te rugăm să selectezi o dată de ridicare!');
      return;
    }

    var reservationList: BookRelationDto[];

    reservationList = localStorage.getItem("reservationList")!== null
                    ? [] : JSON.parse(localStorage.getItem("reservationList")!);
    reservationList.push({isbn: this.book.isbn, count: 1});
    localStorage.setItem("reservationList", JSON.stringify(reservationList));

    const currentUserId = 1; // De preluat din Auth Service în viitor

    // this.loanService.reserve(dto, currentUserId, this.pickupDate).subscribe({
    //   next: () => {
    //     alert('Rezervare confirmată cu succes!');
    //     this.close();
    //   },
    //   error: (err: any) => {
    //     const msg = err.error?.message || err.message || 'Eroare la server';
    //     alert('Eroare: ' + msg);
    //   }
    // });
  }

  close() {
    this.closed.emit();
  }
}