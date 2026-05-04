import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookDataService } from '../../services/data/book.data.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  private bookService = inject(BookDataService);
  totalBooks = 0; booksAvailable = 0; loading = true;
  displayTotal = 0; displayAvailable = 0;

  ngOnInit(): void {
    this.bookService.getStats().subscribe({
      next: (data) => {
        this.totalBooks = data.totalBooks;
        this.booksAvailable = data.booksAvailable;
        this.loading = false;
        setTimeout(() => {
          this.animateCount('displayTotal', this.totalBooks, 1200);
          this.animateCount('displayAvailable', this.booksAvailable, 1000);
        }, 100);
      },
      error: () => { this.loading = false; }
    });
  }

  private animateCount(field: 'displayTotal' | 'displayAvailable', target: number, duration: number): void {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      this[field] = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}