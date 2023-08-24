import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Persona } from "../models/Persona";
import { map, Observable } from 'rxjs';
import { Bibliotecario } from '../models/Bibliotecario_Cargo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private url= environment.rooturl

  private urlendpoint: string = this.url+'/api/validarLogin';
  private urlendpoint1: string = this.url+'/api/num_rol';
  private urlendpoint2: string = this.url+'/api/validarPersona';
  private urlendpoint3: string = this.url+'/persona/listar';
  private urlendpointBuscarCedula: string = this.url+'/persona/personaxcedula';
  private urlendpointeditarpers: string = this.url+'/persona/editar';
  private personaxcedula: string = this.url+'/persona/personaxcedula/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }
  validarLogin(usuario: String, clave: String):Observable<boolean>{
    let res=this.urlendpoint+"?usuario="+usuario+"&clave="+clave;
    return this.http.get<boolean>(res);
  }
  num_rol(usuario: String):Observable<number>{
    let res=this.urlendpoint1+"?usuario="+usuario;
    return this.http.get<number>(res);
  }
  val_persona(usuario:String, clave:String):Observable<Persona>{
    let res=this.urlendpoint2+"?usuario="+usuario+"&clave="+clave;
    return this.http.get<Persona>(res);
  }
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.urlendpoint3);
  }
  listarxcedula(cedula: String)
    : Observable<Persona> {
    let res = this.urlendpointBuscarCedula + "/"+cedula;
    return this.http.get<Persona>(res);
  }
  updatePersona(persona: Persona) {
    return this.http.put<Persona>(this.urlendpointeditarpers + "/" + persona.id, persona);
  }
  buscarxcedula(cedula:string){
    let res=this.personaxcedula+cedula
    return this.http.get<Persona>(res);
  }

 /* tipo_usuario(id_persona:number, rol:number):Observable<Usuario>{
    let res=this.urlendpoint3+"?id_persona="+id_persona+"&rol="+rol;
    return this.http.get<Usuario>(res);
  }
  tipo_biblitecario(id_persona:number, rol:number):Observable<Bibliotecario>{
    let res=this.urlendpoint3+"?id_persona="+id_persona+"&rol="+rol;
    return this.http.get<Bibliotecario>(res);
  }*/
  
}
