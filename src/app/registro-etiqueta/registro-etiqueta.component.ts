import { Component, OnInit } from '@angular/core';
import { Etiqueta } from '../models/Etiqueta';
import { ListasService } from '../services/listas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro-etiqueta',
  templateUrl: './registro-etiqueta.component.html',
  styleUrls: ['./registro-etiqueta.component.css']
})
export class RegistroEtiquetaComponent implements OnInit{
  etiquetas: Etiqueta = new Etiqueta;

  constructor(private listasService: ListasService, private router: Router){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  guardar(){
    this.etiquetas.activo=true;
    this.listasService.createEtiqueta(this.etiquetas).subscribe(
      Response=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '<strong>Guardado correctamente</strong>',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/app-lista-donante']);
      }
    );
  

  }
}
