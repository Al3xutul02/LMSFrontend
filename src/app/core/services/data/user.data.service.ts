import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { UserCreateDto, UserReadDto, UserUpdateDto } from '../../models/dtos/user.dtos';

@Injectable({ providedIn: 'root'})
export class UserDataService 
    extends DataService<UserCreateDto, UserReadDto, UserUpdateDto> {
  constructor() {
    super('user');
  }
}