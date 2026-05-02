import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { LoanCreateDto, LoanReadDto, LoanUpdateDto } from '../../models/dtos/loan.dtos';
import { env } from '../../../../environment';

@Injectable({ providedIn: 'root'})
export class LoanDataService 
    extends DataService<LoanCreateDto, LoanReadDto, LoanUpdateDto> {
  constructor() {
    super(env.endpointMap['loan']);
  }
}