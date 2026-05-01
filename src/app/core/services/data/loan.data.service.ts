import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataService } from './generic/data.service';
import { LoanCreateDto, LoanReadDto, LoanUpdateDto } from '../../models/dtos/loan.dtos';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoanDataService extends DataService<LoanCreateDto, LoanReadDto, LoanUpdateDto> {
  
  constructor() {
    super('Loan');
  }

  /**
   * Trimite cererea de rezervare către Backend.
   */
  reserve(dto: LoanCreateDto, userId: number, pickupDate: string): Observable<any> {
    // Mapăm parametrii de query pentru a genera: ?userId=...&pickupDate=...
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('pickupDate', pickupDate);

    // Trimitem DTO-ul în Body
    return this.http.post(`${this.apiCallUrl}/reserve`, dto, { params });
  }

  getActiveReservations(): Observable<LoanReadDto[]> {
    return this.http.get<LoanReadDto[]>(`${this.apiCallUrl}/get-active-reservations`);
  }

  // Notă: În controllerul tău Delete folosește ApproveAndActivateLoanAsync. 
  // Dacă vrei să refolosești ruta de delete pentru activare:
  activateReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiCallUrl}/delete?id=${id}`);
  }

  getUserLoans(userId: number): Observable<LoanReadDto[]> {
  return this.http.get<LoanReadDto[]>(`${this.apiCallUrl}/Loan/user-loans/${userId}`);
}
}