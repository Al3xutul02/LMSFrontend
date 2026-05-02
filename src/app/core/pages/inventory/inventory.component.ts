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

  // Animated display values
  displayTotal = 0;
  displayAvailable = 0;

  ngOnInit(): void {
    this.bookService.getStats().subscribe({
      next: (data) => {
        this.totalBooks = data.totalBooks;
        this.booksAvailable = data.booksAvailable;
        this.loading = false;
        // Small delay so the cards render before counting starts
        setTimeout(() => {
          this.animateCount('displayTotal', this.totalBooks, 1200);
          this.animateCount('displayAvailable', this.booksAvailable, 1000);
        }, 100);
      },
      error: () => { this.loading = false; }
    });
  }

  private animateCount(
    field: 'displayTotal' | 'displayAvailable',
    target: number,
    duration: number
  ): void {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      this[field] = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
