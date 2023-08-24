import { Component, OnInit } from '@angular/core';
import { Tipo } from '../models/Tipo';
import { ListasService } from '../services/listas.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-tipo',
  templateUrl: './registro-tipo.component.html',
  styleUrls: ['./registro-tipo.component.css']
})
export class RegistroTipoComponent implements OnInit {
  tipo: Tipo = new Tipo;
  constructor(private listasService: ListasService,  private router: Router) { }

  ngOnInit(): void {
  }

  guardar() {
    this.tipo.activo=true;
    this.listasService.createTipo(this.tipo).subscribe(
      response=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '<strong>Guardado correctamente</strong>',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/app-listas']);
      }
    );
  }
}