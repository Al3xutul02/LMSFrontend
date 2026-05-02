import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dto } from '../../../models/app.models';

const BASE_URL = 'http://localhost:5266';

/**
 * Generic base service providing CRUD operations for a given entity.
 * Subclasses pass the entity route prefix (e.g. 'loan', 'branch') to super().
 *
 * Backend route conventions:
 *   GET    /{entity}/get-all
 *   GET    /{entity}/get?id={id}
 *   POST   /{entity}/post
 *   PUT    /{entity}/put
 *   DELETE /{entity}/delete?id={id}
 */
@Injectable()
export abstract class DataService<
  TCreate extends Dto,
  TRead extends Dto,
  TUpdate extends Dto
> {
  protected readonly http = inject(HttpClient);
  private readonly baseUrl: string;

  constructor(entity: string) {
    this.baseUrl = `${BASE_URL}/${entity}`;
  }

  getAll(): Observable<TRead[]> {
    return this.http.get<TRead[]>(`${this.baseUrl}/get-all`);
  }

  getById(id: number): Observable<TRead> {
    return this.http.get<TRead>(`${this.baseUrl}/get`, { params: { id } });
  }

  create(dto: TCreate): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/post`, dto);
  }

  update(dto: TUpdate): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/put`, dto);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/delete`, { params: { id } });
  }
}
