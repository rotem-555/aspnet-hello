import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.validateToken().subscribe();
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('role', response.role);
          this.currentUserSubject.next({
            username: response.username,
            role: response.role
          });
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, registerRequest);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  private validateToken(): Observable<any> {
    return this.http.get(`${this.API_URL}/auth/validate`).pipe(
      map(() => {
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        this.currentUserSubject.next({ username, role });
        return { username, role };
      })
    );
  }
}
