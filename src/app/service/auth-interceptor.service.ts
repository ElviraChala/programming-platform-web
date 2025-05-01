import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token'); // або localStorage.getItem('authToken')

    if (token) {
      // Якщо токен є, додаємо його до заголовка
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned); // Передаємо змінений запит
    }

    // Якщо токена немає, відправляємо звичайний запит
    return next.handle(req);
  }
}
