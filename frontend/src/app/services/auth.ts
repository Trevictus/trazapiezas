import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<{
    token: string;
    user: User;
  }> {
    return this.http.post<{
      token: string;
      user: User;
    }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) localStorage.setItem('token', res.token);
        if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || 'MECHANIC';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}/users`);
  }

  registerUser(username: string, password: string, role: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { username, password, role });
  }

  updateUserPassword(userId: number, newPassword: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/password`, { password: newPassword });
  }

  deleteUser(userId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/users/${userId}`);
  }

  toggleUserStatus(userId: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}/status`, {});
  }
}