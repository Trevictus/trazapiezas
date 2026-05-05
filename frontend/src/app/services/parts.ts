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

  // Gestión de Piezas
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

  // Estadísticas y Movimientos
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getLatestMovements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.movementsUrl}/latest`);
  }

  getMovementsByPlate(plate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.movementsUrl}/vehicle/${plate}`);
  }

  createMovement(movementData: any): Observable<any> {
    return this.http.post(this.movementsUrl, movementData);
  }
}