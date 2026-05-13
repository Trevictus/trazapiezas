import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Part } from '../models/part';
import { Movement } from '../models/movement';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private apiUrl = 'http://localhost:3000/api/parts';
  private movementsUrl = 'http://localhost:3000/api/movements';

  constructor(private http: HttpClient) { }

  // Gestión de Piezas
  getParts(): Observable<Part[]> {
    return this.http.get<Part[]>(this.apiUrl);
  }

  getPartById(id: number): Observable<Part> {
    return this.http.get<Part>(`${this.apiUrl}/${id}`);
  }

  createPart(partData: Omit<Part, 'id'>): Observable<Part> {
    return this.http.post<Part>(this.apiUrl, partData);
  }

  updatePart(id: number, partData: Part): Observable<Part> {
    return this.http.put<Part>(`${this.apiUrl}/${id}`, partData);
  }

  deletePart(id: number): Observable<Part> {
    return this.http.delete<Part>(`${this.apiUrl}/${id}`);
  }

  // Estadísticas y Movimientos
  getStats(): Observable<{
    totalParts: number;
    lowStock: number;
    movementsToday: number;
  }> {
    return this.http.get<{
      totalParts: number;
      lowStock: number;
      movementsToday: number;
    }>(`${this.apiUrl}/stats`);
  }

  getLatestMovements(): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.movementsUrl}/latest`);
  }

  getMovementsByPlate(plate: string): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.movementsUrl}/vehicle/${plate}`);
  }

  createMovement(movementData: Omit<Movement, 'id' | 'createdAt' | 'part' | 'user'>): Observable<Movement> {
    return this.http.post<Movement>(this.movementsUrl, movementData);
  }
}