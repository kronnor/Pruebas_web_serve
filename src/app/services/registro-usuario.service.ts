import { Injectable } from '@angular/core';
//import { Usuario } from '../models/Usuario';
import { Persona } from '../models/Persona';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Bibliotecario } from '../models/Bibliotecario_Cargo';
import { PersonaP } from '../models/PersonaP'; import { Usuario } from '../models/Usuario';
import { PersonaFenix } from '../models/PersonaFenix';
import { environment } from 'src/environments/environment';
;
@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {
  private url= environment.rooturl

  private urlendpointlistarpersonas: string =this.url+'/persona/listar';
  private urlendpointcrearpers: string = this.url+'/persona/crear';
  private urlendpointeditarpers: string = this.url+'/persona/editar';
  private urlendpointbuscar: string = this.url+'/persona/personaxcedula';
  private urlendpointbuscarfuncion: string = this.url+'/persona/personadocente';
  private urlendpoint2: string = this.url+'/usuariofenix/buscarusuario';
  private urlendpoint3: string = this.url+'/api/editarusuario';
  private urlendpoint4: string = this.url+'/persona/registrardocenteadmin';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  /* create(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.urlendpoint, usuario, {headers: this.httpHeaders})
  } */
  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.urlendpointcrearpers, persona, { headers: this.httpHeaders })
  }

  createPersonaFuncion(persona: Persona,rol:string): Observable<any> {
    return this.http.post<Persona>(this.urlendpoint4+"?rol="+rol, persona, {responseType: 'text' as 'json',observe: 'response'})
  }

  updatePersona(persona: Persona) {
    return this.http.put<Persona>(this.urlendpointeditarpers + "/" + persona.id, persona);
  }

  obtenerCedula(cedula: string): Observable<Persona> {
    //return of(CLIENTES)
    return this.http.get<Persona>(this.urlendpointbuscar + "/" + cedula);

  }
  obtenerPersonasCedula(cedula: string): Observable<PersonaFenix> {
    //return of(CLIENTES)
    return this.http.get<Persona>(this.urlendpoint2 + "/" + cedula);

  }
  obtenerPersonasFuncion(cedula: string): Observable<Persona> {
    //return of(CLIENTES)
    return this.http.get<Persona>(this.urlendpointbuscarfuncion + "/" + cedula);

  }
  obtenerPersonasId(id: number) {
    return this.http.get<Persona>(this.urlendpoint4 + "/" + id)
  }
  obtenerUsuarios(): Observable<Persona[]> {
    //return of(CLIENTES)
    return this.http.get<Persona[]>(this.urlendpointlistarpersonas);
  }

  update(usuario: Usuario) {
    return this.http.put<Usuario>(this.urlendpoint3 + "/" + usuario.per_id, usuario);
  }
  obtenerUsuariosId(id: number) {
    return this.http.get<Usuario>(this.urlendpoint4 + "/" + id)
  }
}
