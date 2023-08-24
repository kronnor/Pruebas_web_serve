import { Injectable } from '@angular/core';
import { Prestamo } from '../models/Prestamo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/Libro';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class prestamoService {
  private url= environment.rooturl
  
  private urlEndPoint: string = this.url+'/prestamo/listar';
  private urlEndPoint1: string = this.url+'/prestamo/listarxestado'
  private urlEndPointVerifi: string = this.url+'/prestamo/listaractivosxcedula'
  private urlEndPoint2: string = this.url+'/prestamo/listarxcedula'
  private urlEditar: string = this.url+'/prestamo/editar';
  private urlEndPointCrearPrestamo: string = this.url+'/prestamo/crear';
  private urlEndPointFechas: string = this.url+'/prestamo/reporteprestamos';
  private urlEndPointFechas2: string = this.url+'/prestamo/prestamoconcarrera';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.urlEndPoint);
  }

  create(prestamos: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.urlEndPointCrearPrestamo, prestamos, { headers: this.httpHeaders })
  }

  update(prestamo: Prestamo) {
    return this.http.put<Prestamo>(this.urlEditar + "/" + prestamo.id, prestamo);

  }

  listarxestado(estado_prestamo: number): Observable<Prestamo[]> {
    let res = this.urlEndPoint1 + '?parametro=' + estado_prestamo;
    return this.http.get<Prestamo[]>(res);
  }

  buscarPrestamo(cedula: String): Observable<Prestamo[]> {
    let res = this.urlEndPoint2 + '?cedula=' + cedula;
    return this.http.get<Prestamo[]>(res);
  }

  entreFechas(inicio: String, fin: String): Observable<Prestamo[]> {
    let res = this.urlEndPointFechas + '?inicio=' + inicio + '?fin=' + fin;
    return this.http.get<Prestamo[]>(res);
  }
  prestamoconcarrera(inicio: String, fin: String, idC: number): Observable<Prestamo[]> {
    let res = this.urlEndPointFechas2 + '?carreraId=' + idC + '&inicio=' + inicio + '&fin=' + fin;
    return this.http.get<Prestamo[]>(res);
  }

  verificardeudas(cedula: string): Observable<Prestamo[]> {
    let res = this.urlEndPointVerifi + '?cedula=' + cedula;
    return this.http.get<Prestamo[]>(res);
  }


}
