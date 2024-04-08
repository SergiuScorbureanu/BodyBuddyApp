import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage-service/storage.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   req = req.clone({
  //     withCredentials: true,
  //   });

  //   return next.handle(req);
  // }

  constructor(private storageService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ia tokenul JWT din storage
    const token: string | null = this.storageService.getToken(); // Presupunem că ai o metodă `getToken()`
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    }

    return next.handle(req);
  }
}

// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
// ];