import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { BookCreateDto, BookReadDto, BookUpdateDto } from '../../models/dtos/book.dtos';
import { Observable } from 'rxjs/internal/Observable';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookDataService
    extends DataService<BookCreateDto, BookReadDto, BookUpdateDto> {
  constructor() {
    super('book');
  }

  getStats(): Observable<{ totalBooks: number; booksAvailable: number }> {
    return this.http.get<{ totalBooks: number; booksAvailable: number }>(
      `${this.apiCallUrl}/stats`
    );
  }
  getDetails(isbn: number) {
    return this.http.get<BookReadDto>(`${this.apiCallUrl}/get-details/${isbn}`);
  }
  searchBooks(title: string | null, author: string | null, branchId: number | null)
  : Observable<BookReadDto[]> {
    let params = new HttpParams();
  
    if (title) params = params.set('title', title);
    if (author) params = params.set('author', author);
    if (branchId) params = params.set('branchId', branchId.toString());

    return this.http.get<BookReadDto[]>(
      `${this.apiCallUrl}/get-all-with-filters`, { params });
    }
}