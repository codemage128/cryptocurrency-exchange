import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth:token');
    if (token) {
      
    }
  //   let changedRequest = request;
  //   // HttpHeader object immutable - copy values
  //   const headerSettings: {[name: string]: string | string[]; } = {};

  //   for (const key of request.headers.keys()) {
  //     headerSettings[key] = request.headers.getAll(key);
  //   }
  //   if (token) {
  //     headerSettings['Authorization'] = 'Bearer ' + token;
  //   }
  //   headerSettings['Content-Type'] = 'application/json';
  //   const newHeader = new HttpHeaders(headerSettings);

  //   changedRequest = request.clone({
  //     headers: newHeader});
  //   return next.handle(changedRequest).toPromise();
  // }
    return next.handle(request);
  }
}
