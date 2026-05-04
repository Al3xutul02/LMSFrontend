import { Injectable } from '@angular/core';
import { DataService } from './generic/data.service';
import { UserCreateDto, UserReadDto, UserUpdateDto } from '../../models/dtos/user.dtos';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class UserDataService 
    extends DataService<UserCreateDto, UserReadDto, UserUpdateDto> {
  constructor() {
    super('user');
  }

  getUserProfile(id: number): Observable<UserReadDto> {
    return this.http.get<UserReadDto>(`${this.apiCallUrl}/my-profile/${id}`);
  }

  updateName(id: number, newName: string): Observable<boolean> {
  return this.http.put<boolean>(
    `${this.apiCallUrl}/update-name/${id}`,
    JSON.stringify(newName),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
}