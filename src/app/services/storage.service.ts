import { Injectable } from '@angular/core';
import { Persona } from '../models/Persona';

const ROLE = 'roles';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  user = new Persona();

  constructor() { }

  public clean(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public isLoggedIn(): boolean {
    if (sessionStorage.getItem('userdetails')) {
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }
    return this.user ? true : false;
  }

  public getRole() {
    return localStorage.getItem(ROLE);
  }

}
