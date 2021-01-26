import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    const token = localStorage.getItem('auth:token');
    // if (!!token) {
    //   return true;
    // }
    // this.router.navigateByUrl('/signin');
    // return false;
    return true;
  }
}
