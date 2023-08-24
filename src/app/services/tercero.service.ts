import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sugerencia } from '../models/Sugerencia';
import { Observable } from 'rxjs';
import { Tercero } from '../models/Tercero';
import { TerceroPrestamo } from '../models/TerceroPrestamo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class terceroService {
  private url= environment.rooturl

  private urlEndPoint: string = this.url+'/tercero/terceroxcedula';
  
  private urlEndPointCrear: string = this.url+'/tercero/crear';
  private urlEndPointCrear1: string = this.url+'/terceroprestamo/crear';
  private urlEndPointListar: string = this.url+'/tercero/listar';
  private urlEndPointListarTerPre: string = this.url+'/terceroprestamo/listar';
  private urlEndPointListarTerPreCed: string = this.url+'/terceroprestamo/terceroxcedula';
  private urlEndPointEditar: string = this.url+'/tercero/editar';
  private urlEndPointEditarTerPre: string = this.url+'/tercero/editar';


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }


  create(tercero: Tercero): Observable<Tercero> {
    return this.http.post<Tercero>(this.urlEndPointCrear, tercero, { headers: this.httpHeaders })
  }

  createTerPres(terceroprestamo: TerceroPrestamo): Observable<TerceroPrestamo> {
    return this.http.post<TerceroPrestamo>(this.urlEndPointCrear1, terceroprestamo, { headers: this.httpHeaders })
  }

  terceroxcedula(cedula: string) {
    return this.http.get<Tercero>(this.urlEndPoint + "/" + cedula);
  }

  terceroPrestxcedula(cedula: string) {
    return this.http.get<TerceroPrestamo[]>(this.urlEndPointListarTerPreCed + "/" + cedula);
  }

  obtenerTerceros(): Observable<Tercero[]> {
    //return of(CLIENTES)
    return this.http.get<Tercero[]>(this.urlEndPointListar);
  }
  updateTercero(tercero: Tercero) {
    return this.http.put<Tercero>(this.urlEndPointEditar + "/" + tercero.id, tercero);
  }
  updateTerceroPrestamo(tercero: TerceroPrestamo) {
    return this.http.put<Tercero>(this.urlEndPointEditarTerPre + "/" + tercero.id, tercero);
  }

  obtenerTerPres(): Observable<TerceroPrestamo[]> {
    return this.http.get<TerceroPrestamo[]>(this.urlEndPointListarTerPre);
  }
}