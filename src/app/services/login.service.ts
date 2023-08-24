import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Persona } from '../models/Persona';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  validateLoginDetails(user: Persona) {
    window.sessionStorage.setItem("userdetails", JSON.stringify(user));
    return this.http.get(environment.rooturl + '/ingresar', { observe: 'response', withCredentials: true });
  }

  verificar(email: string, nombres: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('nombres', nombres);
    return this.http.post<any>(environment.rooturl + '/credentials', null, { params: params });
  }
  

}
