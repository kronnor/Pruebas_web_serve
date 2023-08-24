import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autor } from '../models/Autor';
import { ListasService } from '../services/listas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-autor',
  templateUrl: './registro-autor.component.html',
  styleUrls: ['./registro-autor.component.css']
})
export class RegistroAutorComponent implements OnInit {
  autor: Autor = new Autor;

  constructor(private router: Router, private listasServices: ListasService) { }

  ngOnInit(): void {
  }

  guardar() {
    this.listasServices.createAutor(this.autor).subscribe(
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
