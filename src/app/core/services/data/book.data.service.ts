import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { BookCreateDto, BookReadDto, BookUpdateDto } from '../../models/dtos/book.dtos';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root'})
export class BookDataService 
    extends DataService<BookCreateDto, BookReadDto, BookUpdateDto> {
  constructor() {
    super('book');
  }

  searchBooks(title: string | null, author: string | null, branchId: number | null)
  : Observable<BookReadDto[]> {
      return this.http.get<BookReadDto[]>(
        `${this.apiCallUrl}/get-all-with-filters/${title}/${author}/${branchId}`);
    }
}