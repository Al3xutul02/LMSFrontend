import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDataService } from '../../services/data/book.data.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  private bookService = inject(BookDataService);

  totalBooks = 0;
  booksAvailable = 0;
  loading = true;

  ngOnInit(): void {
    this.bookService.getStats().subscribe({
      next: (data) => {
        this.totalBooks = data.totalBooks;
        this.booksAvailable = data.booksAvailable;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}