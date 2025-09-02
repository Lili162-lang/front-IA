import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CookieService } from '../../shared/services/cookie.service';
// import { ToastService } from '../../shared/services/toast.service';
import { LoginRequest, LoginResponse, AuthTokens } from '../../shared/models/auth-tokens.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'userData';
  
  private accessToken = signal<string | null>(this.cookieService.getCookie(this.ACCESS_TOKEN_KEY));
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    // private toastService: ToastService
  ) {
    console.log('AuthService initialized with API URL:', this.API_BASE_URL);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const loginUrl = `${this.API_BASE_URL}/auth/login`;
    console.log('Making login request to:', loginUrl);
    
    return this.http.post<any>(loginUrl, credentials)
      .pipe(
        tap(response => {
          console.log('Login response from .NET backend:', response);
          
          // Handle different response structures from .NET backend
          let tokens: AuthTokens;
          let user: any = null;
          let success = false;
          
          // Check if response has success field or assume success if we have tokens
          if (response.success !== undefined) {
            success = response.success;
          } else if (response.token || response.accessToken) {
            success = true;
          }
          
          if (success) {
            // Extract tokens from different possible structures
            if (response.data) {
              tokens = response.data;
            } else if (response.token || response.accessToken) {
              tokens = {
                accessToken: response.token || response.accessToken,
                refreshToken: response.refreshToken || '',
                expiresIn: response.expiresIn || 3600,
                tokenType: response.tokenType || 'Bearer'
              };
            } else {
              throw new Error('No tokens found in response');
            }
            
            // Extract user data
            user = response.user || response.userData || null;
            
            this.setTokens(tokens);
            if (user) {
              this.cookieService.setCookie(this.USER_KEY, JSON.stringify(user), 7);
            }
            this.isAuthenticatedSubject.next(true);
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          let errorMessage = 'Error al iniciar sesión';
          
          if (error.status === 401) {
            errorMessage = 'Credenciales incorrectas';
          } else if (error.status === 0) {
            errorMessage = 'No se puede conectar al servidor. Verifique la conexión.';
          } else if (error.status === 400) {
            errorMessage = 'Datos de login inválidos';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors && Array.isArray(error.error.errors)) {
            errorMessage = error.error.errors.join(', ');
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
          
          
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearTokens();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    const token = this.accessToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return this.accessToken();
  }

  getRefreshToken(): string | null {
    return this.cookieService.getCookie(this.REFRESH_TOKEN_KEY);
  }

  getCurrentUser(): any {
    const userData = this.cookieService.getCookie(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setTokens(response.data);
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private setTokens(tokens: AuthTokens): void {
    this.accessToken.set(tokens.accessToken);
    
    // Store tokens in secure cookies
    const expirationDays = Math.floor(tokens.expiresIn / (24 * 60 * 60)); // Convert seconds to days
    this.cookieService.setCookie(this.ACCESS_TOKEN_KEY, tokens.accessToken, expirationDays);
    this.cookieService.setCookie(this.REFRESH_TOKEN_KEY, tokens.refreshToken, 30); // 30 days for refresh token
  }

  private clearTokens(): void {
    this.accessToken.set(null);
    this.cookieService.deleteCookie(this.ACCESS_TOKEN_KEY);
    this.cookieService.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.cookieService.deleteCookie(this.USER_KEY);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
