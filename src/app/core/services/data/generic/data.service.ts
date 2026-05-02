import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../../../environment';

export class DataService<TCreateDto, TReadDto, TUpdateDto> {
  protected http: HttpClient = inject(HttpClient);

  protected webApiUrl: string = env.webApiUrl;
  protected controllerMapping: string = '';
  protected apiCallUrl: string;

  constructor(controllerMapping: string) {
    this.controllerMapping = controllerMapping;
    this.apiCallUrl = `${this.webApiUrl}/${this.controllerMapping}`;
  }

  // GET requests
  getItems(): Observable<TReadDto[]> {
    return this.http.get<TReadDto[]>(`${this.apiCallUrl}/get-all`);
  }

  getItemById(id: number): Observable<TReadDto> {
    return this.http.get<TReadDto>(`${this.apiCallUrl}/get/${id}`);
  }

  // POST request
  addItem(item: TCreateDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiCallUrl}/post`, item);
  }

  // PUT request
  updateItem(item: TUpdateDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiCallUrl}/put`, item);
  }

  // DELETE request
  deleteItem(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiCallUrl}/delete/${id}`);
  }
}