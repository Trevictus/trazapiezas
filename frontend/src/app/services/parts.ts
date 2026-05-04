import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private apiUrl = 'http://localhost:3000/api/parts';

  constructor(private http: HttpClient) { }

  getParts(): Observable<any[]> {
    // Recuperamos el token para que el backend nos deje pasar
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  createPart(partData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Enviamos el objeto de la pieza al endpoint POST
    return this.http.post(this.apiUrl, partData, { headers });
  }

  updatePart(id: number, partData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Usamos el método PUT
    return this.http.put(`${this.apiUrl}/${id}`, partData, { headers });
  }

  deletePart(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}