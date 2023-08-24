import { Component, OnInit } from '@angular/core';
import { Bibliotecario } from '../models/Bibliotecario_Cargo';
import { RegistroBibliotecarioService } from '../services/registro-bibliotecario.service';
import { Router } from '@angular/router';
import { Persona } from '../models/Persona';
import { PersonaP } from '../models/PersonaP';
import Swal from 'sweetalert2';
import { PersonaService } from '../services/persona.service';

@Component({
  selector: 'app-form-editBibliotecario',
  templateUrl: './form-edit-b.component.html',
  styleUrls: ['./form-edit-b.component.css']
})
export class FormEditBComponent implements OnInit {
  persona: Persona = {};
  public estado?: string;
  rols?: number;
  RadioAdmin: any = document.getElementById('admin');
  RadioBibliotecario: any = document.getElementById('biblioteca');


  constructor(public personaServices: PersonaService, private router: Router) { }

  ngOnInit(): void {
    let usuarioJSON = localStorage.getItem('ModificarBliotecario') + "";
    this.persona = JSON.parse(usuarioJSON);
  }




  actualizarBibliotecario(personaM: Persona) {
    Swal.fire({
      title: '¿Quieres guardar los cambios?',
      text: "¡No puede revertir los datos!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#012844',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, modificalo!'
    }).then((result) => {
      if (result.isConfirmed) {


        this.personaServices.updatePersona(this.persona)
          .subscribe({
            next: response => {
              Swal.fire({
                title: '<strong>Personal Actualizado!</strong>',
                confirmButtonText: 'OK',
                confirmButtonColor: '#012844',
                icon: 'success',
                html:

                  'El bibliotecario<br><b>' + this.persona?.nombres + ' ' + this.persona.apellidos + '</b><br>' +
                  'ha sido actualizado correctamente'

              });
              this.router.navigate([''])
            },
            error: error => {
              Swal.fire({
                title: '<strong>No se pudo actualizar el personal</strong>',
                confirmButtonColor: '#012844',
                icon: 'error',
              });
            }
          });




      }
    })





  }

  getNombreEstado(estado: boolean | undefined): string {
    let nombreEstado = 'Desconocido'; // Valor predeterminado si el número del estado es undefined

    if (estado !== undefined) {
      if (estado == true) {
        nombreEstado = "Activo";
      }else{
        nombreEstado="Inactivo"
      }
    }

    return nombreEstado;
  }

  /*buscar(idss: string) {

    this.idb = Number.parseInt(idss)

    this.bibliotecarioservice.obtenerBibliotecarioId(this.idb).subscribe(
      bibliotecarioE => {
        this.bibliotecarioE = bibliotecarioE, this.persona.cedula = bibliotecarioE.persona?.cedula, this.persona.nombres = bibliotecarioE.persona?.nombres, this.persona.celular = bibliotecarioE.persona?.celular
        , this.persona.correo = bibliotecarioE.persona?.correo, this.persona.tipo = bibliotecarioE.persona?.tipo
        if(bibliotecarioE.activoBibliotecario==true){
          this.estado="Activo"


        }else if(bibliotecarioE.activoBibliotecario==false){
          this.estado="Inactivo"

        }

        if(bibliotecarioE.persona?.tipo==1){
          this.tipob="Bibliotecario"
          
        }else if(bibliotecarioE.persona?.tipo==0){
          this.tipob="Administrador"
          
        }
      }
    )
  }*/
  tipoBibliotecario(rol: string) {
    this.rols = Number.parseInt(rol)
    if (this.rols == 0) {
      alert("Admin")
    } else if (this.rols == 1) {
      alert("bibliotecario")
    }
  }

}
