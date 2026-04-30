import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookDataService } from '../../services/data/book.data.service';
import { BranchDataService } from '../../services/data/branch.data.service';
import { BookReadDto } from '../../models/dtos/book.dtos';
import { BranchReadDto } from '../../models/dtos/branch.dtos';

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
  branchService: BranchDataService = inject(BranchDataService);

  searchForm: FormGroup;
  books: BookReadDto[] = [];
  branches: BranchReadDto[] = []; 
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
    this.branchService.getItems().subscribe({
      next: (res) => {
        this.branches = res;
      }
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onSearch() {
    this.hasSearched = true;
    if (this.searchForm.value.branchId === 'null') {
      this.searchForm.patchValue({ branchId: null });
    }
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
