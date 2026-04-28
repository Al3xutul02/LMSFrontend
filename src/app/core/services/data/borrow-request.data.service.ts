import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './generic/data.service';
import { BorrowRequestCreateDto, BorrowRequestReadDto } from '../../models/dtos/borrow-request.dtos';

@Injectable({ providedIn: 'root' })
export class BorrowRequestDataService
    extends DataService<BorrowRequestCreateDto, BorrowRequestReadDto, never> {

  constructor() {
    super('borrow-request');
  }

  getPending(): Observable<BorrowRequestReadDto[]> {
    return this.http.get<BorrowRequestReadDto[]>(`${this.apiCallUrl}/get-pending`);
  }

  finish(id: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiCallUrl}/finish?id=${id}`, {});
  }

  reject(id: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiCallUrl}/reject?id=${id}`, {});
  }
}