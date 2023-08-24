import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Libro } from '../models/Libro';
import { Autor } from '../models/Autor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private url= environment.rooturl

  private urlendpoint: string = this.url+'/libro/crear';
  private urlendpoint1: string = this.url+'/libro/listar';
  private urlBuscarLibro: string = this.url+'/libro/listarlibrosxnombre';
  private urlBuscarLibroId: string = this.url+'/libro/buscar';
  private urlListarAutor: string = this.url+'/autor/listar';
  private guardarImagen: string = this.url+'/libro/subirimagen';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  create(libro: any): Observable<Libro> {
    return this.http.post<Libro>(this.urlendpoint, libro, { headers: this.httpHeaders })
  }
  obtenerLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.urlendpoint1);
  }
  buscarLibro(nombre: String)
    : Observable<Libro[]> {
    let res = this.urlBuscarLibro + '/' + nombre;
    return this.http.get<Libro[]>(res);
  }
  buscarLibro1(id: number)
    : Observable<Libro> {
    let res = this.urlBuscarLibroId + '/' + id;
    return this.http.get<Libro>(res);
  }
  subirImagen(id: number, imagen: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('imagen', imagen);

    return this.http.post<any>(`${this.guardarImagen}/${id}`, formData, {
      responseType: 'text' as 'json', // Establece el tipo de respuesta como texto plano
      observe: 'response' // Importante para obtener la respuesta completa, incluyendo el status y headers
    });
  }
}

