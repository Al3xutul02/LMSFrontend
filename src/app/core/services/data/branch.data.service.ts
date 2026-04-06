import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { BranchCreateDto, BranchReadDto, BranchUpdateDto } from '../../models/dtos/branch.dtos';

@Injectable({ providedIn: 'root'})
export class BranchDataService 
    extends DataService<BranchCreateDto, BranchReadDto, BranchUpdateDto> {
  constructor() {
    super('branch');
  }
}