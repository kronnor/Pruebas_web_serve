import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Donante } from '../models/Donante';
import { ListasService } from '../services/listas.service';

@Component({
  selector: 'app-registro-donante',
  templateUrl: './registro-donante.component.html',
  styleUrls: ['./registro-donante.component.css']
})
export class RegistroDonanteComponent implements OnInit {

  donante: Donante = new Donante;

  constructor(private listaservice: ListasService, private router: Router) { }

  ngOnInit(): void {
  }

  guardar() {
    this.listaservice.createDonante(this.donante).subscribe(
      response => {
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
