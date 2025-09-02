import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../admin/services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Check if this is a request to our .NET backend
  const isBackendRequest = req.url.includes(environment.apiUrl) || 
                          req.url.includes('10.72.4.32:7110') || 
                          req.url.startsWith('https://10.72.4.32:7110');
  
  console.log('Interceptor - Request URL:', req.url);
  console.log('Interceptor - Is backend request:', isBackendRequest);
  console.log('Interceptor - Environment API URL:', environment.apiUrl);
  
  if (isBackendRequest) {
    let headers = req.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // Add authorization header if token exists and it's not a login request
    if (token && !req.url.includes('/auth/login')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('Interceptor - Added Authorization header');
    }

    const authReq = req.clone({ headers });
    console.log('Interceptor - Modified request headers:', authReq.headers.keys());
    return next(authReq);
  }

  console.log('Interceptor - Request passed through without modification');
  return next(req);
};
