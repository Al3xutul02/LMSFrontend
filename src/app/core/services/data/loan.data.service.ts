import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { LoanCreateDto, LoanDetailsDto, LoanReadDto, LoanUpdateDto } from '../../models/dtos/loan.dtos';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class LoanDataService 
    extends DataService<LoanCreateDto, LoanReadDto, LoanUpdateDto> {
  constructor() {
    super('loan');
  }
 approveRequest(id: number): Observable<boolean> {
    return this.http.patch(`${this.webApiUrl}/loan/${id}/approve`, {}).pipe( 
      map(() => true)
    );
}

  rejectRequest(id: number): Observable<boolean> {
    return this.http.patch(`${this.webApiUrl}/${id}/reject`, {}).pipe(
      map(() => true)
    );
  }

  getLoanDetails(id: number): Observable<LoanDetailsDto> {
    return this.http.get<LoanDetailsDto>(`${this.webApiUrl}/loan/${id}/details`);
}
}