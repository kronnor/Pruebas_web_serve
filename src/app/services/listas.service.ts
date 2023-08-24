import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Autor } from '../models/Autor';
import { Tipo } from '../models/Tipo';
import { Observable } from 'rxjs';
import { LibroEtiqueta } from '../models/LibroEtiqueta';
import { Etiqueta } from '../models/Etiqueta';
import { environment } from 'src/environments/environment';
import { Donante } from '../models/Donante';
import { Autor_Libro } from '../models/Autor_Libro';
//import { EtiquetaLibro } from '../models/EtiquetaLibro';


@Injectable({
  providedIn: 'root'
})
export class ListasService {

  private url = environment.rooturl

  private urlendpoint: string = this.url + '/autor/listar';
  private urlendpoint2: string = this.url + '/autorlibro/listar';
  private urlendpoint1: string = this.url + '/tipo/listar';
  private urlendpointAutor: string = this.url + '/autor/crear';
  private urlendpointBuscarAutor: string = this.url + '/autor/listarautoresxnombre';
  private urlendpointBuscarTipo: string = this.url + '/tipo/buscarxnombre';
  private urlendpointTipo: string = this.url + '/tipo/crear';
  private listarEtiqueta: string = this.url + '/etiqueta/listar';
  private seleccionarEti: string = this.url + '/etiqueta/buscar';
  private crearetiqueta: string = this.url + '/tags/crear';
  private buscaretiqueta: string = this.url + '/tags/etiquetasxlibro';
  private urlendpointBuscarDonante: string = this.url + '/donante/listarxnombre';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  obtenerAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.urlendpoint);
  }

  obtenerAutor_Libro(): Observable<Autor_Libro[]> {
    return this.http.get<Autor_Libro[]>(this.urlendpoint2);
  }
  obtenerTipos(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(this.urlendpoint1);
  }

  createTipo(tipo: Tipo): Observable<Tipo> {
    return this.http.post<Tipo>(this.urlendpointTipo, tipo, { headers: this.httpHeaders })
  }

  createAutor(autor: Autor): Observable<Autor> {
    return this.http.post<Autor>(this.urlendpointAutor, autor, { headers: this.httpHeaders })
  }


  listarautoresxnombre(nombre: string)
    : Observable<Autor[]> {
    let res = this.urlendpointBuscarAutor + "/" + nombre;
    return this.http.get<Autor[]>(res);
  }
  buscarTiposxnombre(nombre: string)
    : Observable<Tipo[]> {
    let res = this.urlendpointBuscarTipo + "?nombre=" + nombre;
    return this.http.get<Tipo[]>(res);
  }
  buscarTiposxnombre2(nombre: string) {
    let res = this.urlendpointBuscarTipo + "?nombre=" + nombre;
    return this.http.get<Tipo>(res);
  }

  buscarEtiquetas(id: number): Observable<LibroEtiqueta[]> {
    let res = this.buscaretiqueta + "?parametro=" + id;
    return this.http.get<LibroEtiqueta[]>(res);
  }

  obteneEtiquetas(): Observable<Etiqueta[]> {
    return this.http.get<Etiqueta[]>(this.listarEtiqueta);
  }
  SeleccionarEti(id: number): Observable<Etiqueta> {
    let res = this.seleccionarEti + "/" + id;
    return this.http.get<Etiqueta>(res);
  }

  createEtiqueta(tipo: LibroEtiqueta): Observable<LibroEtiqueta> {
    return this.http.post<LibroEtiqueta>(this.crearetiqueta, tipo, { headers: this.httpHeaders })
  }

  eliminarEtiqueta(parametro: number): Observable<any> {
    const url = environment.rooturl + '/tags/eliminaretiqueta?parametro=' + parametro;
    return this.http.delete<any>(url, {
      responseType: 'text' as 'json', // Establece el tipo de respuesta como texto plano
      observe: 'response' // Importante para obtener la respuesta completa, incluyendo el status y headers
    });
  }
  listarDonate()
    : Observable<Donante[]> {
    let res = environment.rooturl + '/donante/listar'
    return this.http.get<Donante[]>(res);
  }

  listarAutor()
    : Observable<Autor[]> {
    let res = environment.rooturl + '/autor/listar'
    return this.http.get<Autor[]>(res);
  }

  createAutorLibro(autor: Autor_Libro): Observable<Autor_Libro> {
    let res = environment.rooturl + '/autorlibro/crear'
    return this.http.post<Autor_Libro>(res, autor, { headers: this.httpHeaders })
  }

  createDonante(donante: Donante): Observable<Donante> {
    let res = environment.rooturl + '/donante/crear'
    return this.http.post<Donante>(res, donante, { headers: this.httpHeaders })
  }

  listarxnombre(nombre: string)
    : Observable<Donante[]> {
    let res = this.urlendpointBuscarDonante + "/" + nombre;
    return this.http.get<Donante[]>(res);
  }

}
