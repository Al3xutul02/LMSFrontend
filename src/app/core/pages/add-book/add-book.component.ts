import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookDataService } from '../../services/data/book.data.service';
import { BookCreateDto } from '../../models/dtos/book.dtos';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  private bookService = inject(BookDataService);

  title = '';
  author = '';
  quantity = 1;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    if (!this.title.trim() || !this.author.trim() || this.quantity < 1) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const dto: BookCreateDto = {
      isbn: 0,
      title: this.title.trim(),
      author: this.author.trim(),
      description: '',
      genres: [],
      count: this.quantity,
      status: 'in-stock'
    };

    this.bookService.addItem(dto).subscribe({
      next: () => {
        this.successMessage = 'Book added successfully.';
        this.title = '';
        this.author = '';
        this.quantity = 1;
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'Failed to add book.';
        this.submitting = false;
      }
    });
  }
}