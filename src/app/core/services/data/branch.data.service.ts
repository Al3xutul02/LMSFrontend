import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { BranchCreateDto, BranchReadDto, BranchUpdateDto } from '../../models/dtos/branch.dtos';
import { env } from '../../../../environment';

@Injectable({ providedIn: 'root'})
export class BranchDataService 
    extends DataService<BranchCreateDto, BranchReadDto, BranchUpdateDto> {
  constructor() {
    super(env.endpointMap['branch']);
  }
}