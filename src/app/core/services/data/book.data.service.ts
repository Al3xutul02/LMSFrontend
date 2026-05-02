import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { BookCreateDto, BookReadDto, BookUpdateDto } from '../../models/dtos/book.dtos';
import { env } from '../../../../environment';

@Injectable({ providedIn: 'root'})
export class BookDataService 
    extends DataService<BookCreateDto, BookReadDto, BookUpdateDto> {
  constructor() {
    super(env.endpointMap['book']);
  }
}