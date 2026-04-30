import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { BookCreateDto, BookReadDto, BookUpdateDto } from '../../models/dtos/book.dtos';
import { Observable } from 'rxjs';

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
}