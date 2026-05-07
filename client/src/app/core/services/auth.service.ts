import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'inventory_token';
  private readonly USER_KEY = 'inventory_user';

  private _currentUser = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(this.loadToken());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  register(name: string, email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, { name, email, password })
      .pipe(
        tap((res) => this.handleAuth(res)),
        catchError(this.handleError)
      );
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => this.handleAuth(res)),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  refreshUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/me`).pipe(
      tap((res) => {
        if (res.data) {
          this._currentUser.set(res.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
        }
      })
    );
  }

  private handleAuth(res: ApiResponse<AuthResponse>): void {
    if (res.data) {
      localStorage.setItem(this.TOKEN_KEY, res.data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
      this._token.set(res.data.token);
      this._currentUser.set(res.data.user);
    }
  }

  private handleError(error: { error?: { message?: string }; message?: string }) {
    const message = error.error?.message || error.message || 'An error occurred';
    return throwError(() => new Error(message));
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
