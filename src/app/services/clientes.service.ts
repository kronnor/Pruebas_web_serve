import { Injectable } from '@angular/core';
//import{CLIENTES} from './clientes.json';
import { Observable,of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url= environment.rooturl
  private urlendpoint:string=this.url+'/api/clientes';
  constructor(private http:HttpClient) { }
 /* obtenerClientes(): Observable < Cliente[]>{
    //return of (CLIENTES);
    return this.http.get<Cliente[]>(this.urlendpoint);
  }*/
}
