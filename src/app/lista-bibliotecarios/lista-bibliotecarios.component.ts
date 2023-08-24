import { Component, OnInit } from '@angular/core';
import { Persona } from '../models/Persona';
import { PersonaService } from '../services/persona.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-lista-bibliotecarios',
  templateUrl: './lista-bibliotecarios.component.html',
  styleUrls: ['./lista-bibliotecarios.component.css']
})
export class ListaBibliotecariosComponent implements OnInit {
  bibliotecarios: Persona[] = [];
  Bibliotecario:Persona=new Persona();
  val: String = "";
  bus?: boolean;
  buscarval: boolean = false;

  constructor(private personaService: PersonaService,  private router: Router) { }

  ngOnInit(): void {
    this.personaService.getPersonas().subscribe(
      response => {
        response.forEach(element => {
          if (element.tipo== 3 || element.tipo==4) {
            this.bibliotecarios.push(element);
          }
        });
      }
    );
    this.bus = false;
  }

 onKeydownEvent(event: KeyboardEvent, cedula: String): void {
  if (cedula == "") {
    this.bus = false;
  }else if(cedula.length===10){
    this.personaService.listarxcedula(cedula+"").subscribe(
      response=>(
        this.Bibliotecario=response,
        this.bus = true
      ),(error)=>(
        this.bus = false,
        Swal.fire({
          title: '<strong>¡Usuario no encontrado!</strong>',
            confirmButtonText: 'OK',
            confirmButtonColor: '#012844',
            icon: 'error'
          
         }
         
        )
      )
    )
  }else if(cedula.length>10){
    Swal.fire({
      title: '<strong>¡Ingrese un numero de cedula!</strong>',
        confirmButtonText: 'OK',
        confirmButtonColor: '#012844',
        icon: 'error'
      
     }
     
    )

  }
}

  

 modificar(bibliotecario:Persona){
  const objetoString = JSON.stringify(bibliotecario);
    localStorage.setItem("ModificarBliotecario", objetoString);
    this.router.navigate(['/app-form-editBibliotecario']);
 }

}
