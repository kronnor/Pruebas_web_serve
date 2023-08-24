import { Injectable } from '@angular/core';
import { Bibliotecario } from '../models/Bibliotecario_Cargo';
import { Observable,of } from 'rxjs';
import { PersonaP } from '../models/PersonaP';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonaFenix } from '../models/PersonaFenix';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RegistroBibliotecarioService {
  private url= environment.rooturl

  private urlendpoint:string=this.url+'/bibliotecariocargo/crear';
  private urlendpoint1:string=this.url+'/api/listarbibliotecario';
  private urlendpoint2:string=this.url+'/api/bibliotecario_x_cedula';
  private urlendpointFenix: string = this.url+'/usuariofenix/buscarusuario';
  private urlendpoint4:string=this.url+'/api/fenix_docente';
  private urlendpoint5:string=this.url+'/api/editarbibliotecario';
  private urlendpoint6:string=this.url+'/api/bibliotecario';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http:HttpClient) { }


  obtenerPersonasCedula(cedula: string): Observable<PersonaFenix> {
    //return of(CLIENTES)
    return this.http.get<PersonaFenix>(this.urlendpointFenix + "/" + cedula);

  }
  create(bibliotecario:Bibliotecario):Observable<Bibliotecario>{
    return this.http.post<Bibliotecario>(this.urlendpoint, bibliotecario, {headers: this.httpHeaders})
  }
  obtenerBibliotecarios(): Observable<Bibliotecario[]> {
    //return of(CLIENTES)
    return this.http.get<Bibliotecario[]>(this.urlendpoint1);
  }

  obtenerPersonasId(ced:string) : Observable<PersonaP>{
    //return of(CLIENTES)
    return this.http.get<PersonaP>(this.urlendpoint4+"?ced="+ced);
  }

  buscarBibliotecarios(cedula:String):Observable<Bibliotecario>{
    let res=this.urlendpoint2+"?ced="+cedula;
    return this.http.get<Bibliotecario>(res);
  }

  update(bibliotecario:Bibliotecario){
    return this.http.put<Bibliotecario>(this.urlendpoint5+"/"+bibliotecario.id,bibliotecario);
      
  }

  obtenerBibliotecarioId(id:number){
    return this.http.get<Bibliotecario>(this.urlendpoint6+"/"+id)
  }
}
