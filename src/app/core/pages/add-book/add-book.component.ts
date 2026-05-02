import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookDataService } from '../../services/data/book.data.service';
import { BookCreateDto } from '../../models/dtos/book.dtos';
import { BookGenre, BookStatus } from '../../models/app.models';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  private bookService = inject(BookDataService);

  // Form fields
  isbn = 0;
  title = '';
  author = '';
  description = '';
  count = 1;
  status: BookStatus = 'in-stock';
  selectedGenres: BookGenre[] = [];

  // UI state
  submitting = false;
  successMessage = '';
  errorMessage = '';

  readonly allGenres: BookGenre[] = [
    'action', 'adventure', 'art-and-photography', 'biography', 'children',
    'coming-of-age', 'contemporary-fiction', 'cook-books', 'dystopian',
    'fantasy', 'graphic-novel', 'guide-or-how-to', 'historical-fiction',
    'history', 'horror', 'humanities-and-social-sciences', 'humor',
    'memoir', 'mistery', 'parenting-and-families', 'philosophy',
    'religion-and-spirituality', 'romance', 'science-and-technology',
    'science-fiction', 'self-help', 'short-story', 'thriller',
    'travel', 'true-crime', 'young-adult'
  ];

  readonly statusOptions: { value: BookStatus; label: string }[] = [
    { value: 'in-stock',               label: 'In Stock' },
    { value: 'out-of-stock',           label: 'Out of Stock' },
    { value: 'temporarily-unavailable',label: 'Temporarily Unavailable' },
    { value: 'discontinued',           label: 'Discontinued' }
  ];

  formatGenre(genre: BookGenre): string {
    return genre.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

  isGenreSelected(genre: BookGenre): boolean {
    return this.selectedGenres.includes(genre);
  }

  toggleGenre(genre: BookGenre): void {
    if (this.isGenreSelected(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres = [...this.selectedGenres, genre];
    }
  }

  reset(): void {
    this.isbn = 0;
    this.title = '';
    this.author = '';
    this.description = '';
    this.count = 1;
    this.status = 'in-stock';
    this.selectedGenres = [];
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.title.trim() || !this.author.trim()) {
      this.errorMessage = 'Title and Author are required.';
      return;
    }
    if (this.count < 1) {
      this.errorMessage = 'Quantity must be at least 1.';
      return;
    }

    this.submitting = true;

    const dto: BookCreateDto = {
      isbn: this.isbn,
      title: this.title.trim(),
      author: this.author.trim(),
      description: this.description.trim(),
      genres: this.selectedGenres,
      count: this.count,
      status: this.status
    };

    this.bookService.addItem(dto).subscribe({
      next: () => {
        this.successMessage = `"${dto.title}" has been added to the library!`;
        this.reset();
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'Failed to add book. Please try again.';
        this.submitting = false;
      }
    });
  }
}
