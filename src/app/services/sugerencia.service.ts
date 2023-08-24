import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sugerencia } from '../models/Sugerencia';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class sugerenciaService{
  private url= environment.rooturl

  private urlCrearsugerencia: string = this.url+'/sugerencia/crear';
  private urlEndPoint: string = this.url+'/sugerencia/listar'

  
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  create(sugerencias: Sugerencia): Observable<Sugerencia> {
    return this.http.post<Sugerencia>(this.urlCrearsugerencia, sugerencias,{headers:this.httpHeaders})

  }

  getSugerencia():Observable<Sugerencia[]> {
    return this.http.get<Sugerencia[]>(this.urlEndPoint);
  }
  
}