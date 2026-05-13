import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shelf } from '../models/shelf';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'http://localhost:3000/api/shelves';

  constructor(private http: HttpClient) { }

  getShelves(): Observable<Shelf[]> {
    return this.http.get<Shelf[]>(this.apiUrl);
  }

  getShelfById(id: string): Observable<Shelf> {
    return this.http.get<Shelf>(`${this.apiUrl}/${id}`);
  }

  createShelf(shelfData: Omit<Shelf, 'id' | 'parts'>): Observable<Shelf> {
    return this.http.post<Shelf>(this.apiUrl, shelfData);
  }

  updateShelf(id: string, shelfData: Shelf): Observable<Shelf> {
    return this.http.put<Shelf>(`${this.apiUrl}/${id}`, shelfData);
  }

  deleteShelf(id: string): Observable<Shelf> {
    return this.http.delete<Shelf>(`${this.apiUrl}/${id}`);
  }
}
