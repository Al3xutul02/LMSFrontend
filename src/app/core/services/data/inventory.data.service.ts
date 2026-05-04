import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InventoryDataService {
  private http = inject(HttpClient);
  private base = 'http://localhost:5266/inventory';

  /** Add `count` copies of a book to a branch */
  addBooks(branchId: number, bookISBN: number, count: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.base}/add/${branchId}/${bookISBN}/${count}`, {}
    );
  }

  /** Remove `count` copies of a book from a branch */
  removeBooks(branchId: number, bookISBN: number, count: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.base}/remove/${branchId}/${bookISBN}/${count}`, {}
    );
  }
}
