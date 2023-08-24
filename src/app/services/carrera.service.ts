import { Injectable } from '@angular/core';
import { Carrera } from '../models/Carrera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private url= environment.rooturl

    private urlEndPoint: string=this.url+'/carrera/listar';
    private urlEndPointBuscarId: string=this.url+'/carrera/buscar';
    private urlEndPointBuscarEst: string=this.url+'/carrera/carreraest';
  constructor(private http: HttpClient) { }
  getCarreras(): Observable <Carrera[]>{
    return this.http.get<Carrera[]>(this.urlEndPoint);
  }
  obtenerCarreraId(id:number) : Observable<Carrera>{
    //return of(CLIENTES)
    return this.http.get<Carrera>(this.urlEndPointBuscarId+"/"+id);
  }
  carreraest(cedula:string) : Observable<Carrera>{
    //return of(CLIENTES)
    return this.http.get<Carrera>(this.urlEndPointBuscarEst+"/"+cedula);
  }
}