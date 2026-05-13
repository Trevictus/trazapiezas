import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'http://localhost:3000/api/shelves';

  constructor(private http: HttpClient) { }

  getShelves(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getShelfById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createShelf(shelfData: any): Observable<any> {
    return this.http.post(this.apiUrl, shelfData);
  }

  updateShelf(id: string, shelfData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, shelfData);
  }

  deleteShelf(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
