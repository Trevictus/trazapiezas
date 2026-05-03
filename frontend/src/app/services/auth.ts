import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La URL donde escucha tu servidor de Node.js
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    // Enviamos el username y password al backend
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}