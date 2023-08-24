import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Persona } from '../models/Persona';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  user = new Persona();

  constructor(private storageService: StorageService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot): boolean {
      const isLoggedIn = this.storageService.isLoggedIn();
      const expectedRoles = route.data['expectedRoles'];
      const role = this.storageService.getRole();
      if (isLoggedIn && expectedRoles.includes(role)) {
          return true;
      }
      this.logOut();
      return false;
  }

  logOut(): void {
    window.sessionStorage.clear();
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
