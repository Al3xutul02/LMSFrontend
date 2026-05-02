import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { UserCreateDto, UserReadDto, UserUpdateDto } from '../../models/dtos/user.dtos';
import { env } from '../../../../environment';

@Injectable({ providedIn: 'root'})
export class UserDataService 
    extends DataService<UserCreateDto, UserReadDto, UserUpdateDto> {
  constructor() {
    super(env.endpointMap['user']);
  }
}