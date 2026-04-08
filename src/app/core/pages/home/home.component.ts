import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookDataService } from '../../services/data/book.data.service';

@Component({
  selector: 'home',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  bookService: BookDataService = inject(BookDataService);

  searchForm: FormGroup;
  books: any[] = [];
  branches: any[] = []; 
  showFilters = false;
  hasSearched = false;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      title: [''],
      author: [''],
      branchId: [null]
    });
  }

  ngOnInit(): void {
    this.branches = [
      { id: 1, name: 'Biblioteca Centrală' },
      { id: 2, name: 'Filiala Copou' }
    ];
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onSearch() {
    this.hasSearched = true;
    const values = this.searchForm.value;

    this.bookService.searchBooks(values.title, values.author, values.branchId).subscribe({
      next: (res) => {
        this.books = res;
      },
      error: (err) => {
        console.error('Search error', err);
      }
    });
  }
}
