// src/app/admin/services/auth.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken = signal<string | null>(localStorage.getItem('accessToken'));

  isLoggedIn(): boolean {            // <- el método que usa el guard
    return !!this.accessToken();
  }

  login(token: string): void {
    this.accessToken.set(token);
    localStorage.setItem('accessToken', token);
  }

  logout(): void {
    this.accessToken.set(null);
    localStorage.removeItem('accessToken');
  }

  getToken(): string | null {        // útil para el AuthInterceptor
    return this.accessToken();
  }
}
