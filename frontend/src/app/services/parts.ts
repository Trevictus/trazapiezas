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
}