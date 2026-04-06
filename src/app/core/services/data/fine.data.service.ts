import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { FineCreateDto, FineReadDto, FineUpdateDto } from '../../models/dtos/fine.dtos';

@Injectable({ providedIn: 'root'})
export class FineDataService 
    extends DataService<FineCreateDto, FineReadDto, FineUpdateDto> {
  constructor() {
    super('fine');
  }
}