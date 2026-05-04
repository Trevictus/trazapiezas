import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private apiUrl = 'http://localhost:3000/api/parts';
  private movementsUrl = 'http://localhost:3000/api/movements'; 

  constructor(private http: HttpClient) { }

  getParts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPartById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPart(partData: any): Observable<any> {
    return this.http.post(this.apiUrl, partData);
  }

  updatePart(id: number, partData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, partData);
  }

  deletePart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getMovementsByPlate(plate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.movementsUrl}/vehicle/${plate}`);
  }

  // 🚀 Registrar un nuevo movimiento (STOCK o USED)
  createMovement(movementData: any): Observable<any> {
    return this.http.post(this.movementsUrl, movementData);
  }
}