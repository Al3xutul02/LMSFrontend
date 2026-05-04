import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { BookDataService } from '../../services/data/book.data.service';
import { BranchDataService } from '../../services/data/branch.data.service';
import { InventoryDataService } from '../../services/data/inventory.data.service';
import { BookReadDto, BookUpdateDto } from '../../models/dtos/book.dtos';
import { BranchReadDto } from '../../models/dtos/branch.dtos';
import { BookGenre, BookStatus } from '../../models/app.models';

interface BookEditForm {
  isbn: number;
  title: string;
  author: string;
  description: string;
  count: number;
  status: BookStatus;
  genres: BookGenre[];
}

interface BranchStockRow {
  branchId: number;
  branchName: string;
  currentCount: number;
  newCount: number;
}

@Component({
  selector: 'app-update-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.css']
})
export class UpdateInventoryComponent implements OnInit {
  private bookService    = inject(BookDataService);
  private branchService  = inject(BranchDataService);
  private inventoryService = inject(InventoryDataService);
  private router         = inject(Router);

  // ── Data ────────────────────────────────────────────────────────
  books:         BookReadDto[]   = [];
  branches:      BranchReadDto[] = [];
  filteredBooks: BookReadDto[]   = [];

  // ── UI state ─────────────────────────────────────────────────────
  loading        = true;
  searchQuery    = '';
  expandedISBN:  number | null = null;
  savingBookISBN: number | null = null;
  savingStockISBN: number | null = null;
  toast: { type: 'success' | 'error'; message: string } | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  // ── Per-book edit state ──────────────────────────────────────────
  editForms  = new Map<number, BookEditForm>();
  stockRows  = new Map<number, BranchStockRow[]>();

  // ── Constants ────────────────────────────────────────────────────
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
    { value: 'in-stock',                label: 'In Stock' },
    { value: 'out-of-stock',            label: 'Out of Stock' },
    { value: 'temporarily-unavailable', label: 'Temporarily Unavailable' },
    { value: 'discontinued',            label: 'Discontinued' }
  ];

  // ── Lifecycle ────────────────────────────────────────────────────
  ngOnInit(): void {
    forkJoin([
      this.bookService.getItems(),
      this.branchService.getItems()
    ]).subscribe({
      next: ([books, branches]) => {
        this.books    = books;
        this.branches = branches;
        this.filteredBooks = [...books];
        books.forEach(b => this.initBook(b));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToast('error', 'Failed to load data. Please check the backend is running.');
      }
    });
  }

  // ── Init helpers ─────────────────────────────────────────────────
  private initBook(book: BookReadDto): void {
    this.editForms.set(book.isbn, {
      isbn:        book.isbn,
      title:       book.title,
      author:      book.author,
      description: book.description,
      count:       book.count,
      status:      book.status,
      genres:      book.genres ? [...book.genres] : []
    });
  }

  private buildStockRows(isbn: number): BranchStockRow[] {
    return this.branches.map(branch => {
      const rel = branch.bookRelations?.find(r => r.isbn === isbn);
      const count = rel?.count ?? 0;
      return {
        branchId:     branch.id,
        branchName:   branch.name,
        currentCount: count,
        newCount:     count
      };
    });
  }

  // ── Search / filter ──────────────────────────────────────────────
  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredBooks = q
      ? this.books.filter(b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          String(b.isbn).includes(q))
      : [...this.books];
  }

  // ── Expand / collapse ─────────────────────────────────────────────
  toggleExpand(isbn: number): void {
    if (this.expandedISBN === isbn) {
      this.expandedISBN = null;
    } else {
      this.expandedISBN = isbn;
      if (!this.stockRows.has(isbn)) {
        this.stockRows.set(isbn, this.buildStockRows(isbn));
      }
    }
  }

  isExpanded(isbn: number): boolean {
    return this.expandedISBN === isbn;
  }

  getForm(isbn: number): BookEditForm {
    return this.editForms.get(isbn)!;
  }

  getStockRows(isbn: number): BranchStockRow[] {
    return this.stockRows.get(isbn) ?? [];
  }

  // ── Genre helpers ────────────────────────────────────────────────
  isGenreSelected(isbn: number, genre: BookGenre): boolean {
    return this.getForm(isbn).genres.includes(genre);
  }

  toggleGenre(isbn: number, genre: BookGenre): void {
    const form = this.getForm(isbn);
    if (form.genres.includes(genre)) {
      form.genres = form.genres.filter(g => g !== genre);
    } else {
      form.genres = [...form.genres, genre];
    }
  }

  formatGenre(genre: BookGenre): string {
    return genre.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

  // ── Quantity helpers ─────────────────────────────────────────────
  decBook(isbn: number): void {
    const f = this.getForm(isbn);
    if (f.count > 0) f.count--;
  }

  incBook(isbn: number): void {
    this.getForm(isbn).count++;
  }

  decStock(row: BranchStockRow): void {
    if (row.newCount > 0) row.newCount--;
  }

  incStock(row: BranchStockRow): void {
    row.newCount++;
  }

  // ── Save book details ────────────────────────────────────────────
  saveBook(isbn: number): void {
    const form = this.getForm(isbn);
    if (!form.title.trim() || !form.author.trim()) {
      this.showToast('error', 'Title and Author are required.');
      return;
    }

    this.savingBookISBN = isbn;
    const dto: BookUpdateDto = {
      isbn:        form.isbn,
      title:       form.title.trim(),
      author:      form.author.trim(),
      description: form.description.trim(),
      count:       form.count,
      status:      form.status,
      genres:      form.genres,
      imagePath:   this.books.find(b => b.isbn === isbn)?.imagePath ?? ''
    };

    this.bookService.updateItem(dto).subscribe({
      next: () => {
        // Sync back into the master list
        const idx = this.books.findIndex(b => b.isbn === isbn);
        if (idx !== -1) {
          this.books[idx] = { ...this.books[idx], ...dto };
          this.filteredBooks = this.filteredBooks.map(b =>
            b.isbn === isbn ? this.books[idx] : b);
        }
        this.savingBookISBN = null;
        this.showToast('success', `"${dto.title}" updated successfully.`);
      },
      error: () => {
        this.savingBookISBN = null;
        this.showToast('error', 'Failed to update book details.');
      }
    });
  }

  // ── Save branch stock ─────────────────────────────────────────────
  saveStock(isbn: number): void {
    const rows = this.getStockRows(isbn);
    const changed = rows.filter(r => r.newCount !== r.currentCount);
    if (changed.length === 0) {
      this.showToast('success', 'No stock changes to save.');
      return;
    }

    this.savingStockISBN = isbn;
    const calls: Observable<boolean>[] = [];

    for (const row of changed) {
      const delta = row.newCount - row.currentCount;
      if (delta > 0) {
        calls.push(this.inventoryService.addBooks(row.branchId, isbn, delta));
      } else {
        calls.push(this.inventoryService.removeBooks(row.branchId, isbn, Math.abs(delta)));
      }
    }

    forkJoin(calls).subscribe({
      next: () => {
        // Update currentCount so next save knows the baseline
        rows.forEach(r => { r.currentCount = r.newCount; });
        this.savingStockISBN = null;
        this.showToast('success', 'Branch stock updated successfully.');
      },
      error: () => {
        this.savingStockISBN = null;
        this.showToast('error', 'Some stock updates failed. Please retry.');
      }
    });
  }

  // ── Toast ────────────────────────────────────────────────────────
  private showToast(type: 'success' | 'error', message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { type, message };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 4000);
  }

  // ── Navigation ────────────────────────────────────────────────────
  goBack(): void {
    this.router.navigate(['/librarian/inventory']);
  }
}
