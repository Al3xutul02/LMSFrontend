import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './generic/data.service';
import { LoanCreateDto, LoanReadDto, LoanUpdateDto } from '../../models/dtos/loan.dtos';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class LoanDataService extends DataService<LoanCreateDto, LoanReadDto, LoanUpdateDto> {
  
  constructor() {
    super('Loan');
  }

  reserve(dto: LoanCreateDto, userId: number, pickupDate: string): Observable<any> {
    return this.http.post(`${this.apiCallUrl}/reserve?userId=${userId}&pickupDate=${pickupDate}`, dto);
  }

  getActiveReservations(): Observable<LoanReadDto[]> {
    return this.http.get<LoanReadDto[]>(`${this.apiCallUrl}/get-active-reservations`);
  }

  activateReservation(id: number): Observable<LoanReadDto> {
    return this.http.patch<LoanReadDto>(`${this.apiCallUrl}/activate-reservation/${id}`, {});
  }
}