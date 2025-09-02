import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../../admin/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken && !req.url.includes('/auth/refresh')) {
          // Try to refresh the token
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Retry the original request with new token
              const token = authService.getToken();
              const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
              });
              return next(authReq);
            }),
            catchError(() => {
              // Refresh failed, redirect to login
              authService.logout();
              return throwError(() => error);
            })
          );
        } else {
          // No refresh token or refresh endpoint failed
          authService.logout();
        }
      }

      // Handle other HTTP errors
      let errorMessage = 'An unexpected error occurred';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You don\'t have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      }

      console.error('HTTP Error:', error);
      
      // You can integrate with a toast/notification service here
      // this.notificationService.showError(errorMessage);
      
      return throwError(() => ({ ...error, userMessage: errorMessage }));
    })
  );
};
