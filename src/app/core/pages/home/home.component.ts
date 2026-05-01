import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookDataService } from '../../services/data/book.data.service';
import { BranchDataService } from '../../services/data/branch.data.service';
import { BookReadDto } from '../../models/dtos/book.dtos';
import { BranchReadDto } from '../../models/dtos/branch.dtos';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { pipe, Subscription, tap, timer } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'home',
  imports: [
    ReactiveFormsModule,
    BookDetailsComponent,
    RouterLink
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  bookService: BookDataService = inject(BookDataService);
  branchService: BranchDataService = inject(BranchDataService);
  hoverTimer: Subscription | null = null;
  hoverPosition = signal({ x: 0, y: 0});

  searchForm: FormGroup;
  books: BookReadDto[] = [];
  branches: BranchReadDto[] = [];
  public hoveredBook: BookReadDto | null = null;
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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSearch(): void {
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

  onMouseEnter(book: BookReadDto): void {
    this.hoverTimer?.unsubscribe();
    this.hoverTimer = timer(300).subscribe(() => {
      this.hoveredBook = book;
    });
  }

  onMouseLeave(): void {
    this.hoverTimer?.unsubscribe();
    this.hoveredBook = null;
  }

  onMouseMove(event: MouseEvent): void {
    this.hoverPosition.set({ x: event.clientX, y: event.clientY });
  }
}
