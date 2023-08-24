import { Component } from '@angular/core';
import { Prestamo } from '../models/Prestamo';
import { prestamoService } from '../services/prestamo.service';
import { Carrera } from '../models/Carrera';
import { CarreraService } from '../services/carrera.service';
import { Persona } from '../models/Persona';
import { PersonaService } from '../services/persona.service';
import { Router } from '@angular/router';
import { Libro } from '../models/Libro';
import { LibroService } from '../services/libro.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { catchError, throwError } from "rxjs";

@Component({
  selector: 'app-registro-solicitud',
  templateUrl: './registro-solicitud.component.html',
  styleUrls: ['./registro-solicitud.component.css']
})
export class RegistroSolicitudComponent {
  prestamo: Prestamo = new Prestamo();
  persona: Persona = new Persona();
  bibliotecario: Persona = new Persona();
  carreras: Carrera[] = [];
  libros: Libro[] = [];
  libro: Libro = new Libro();

  public dat!: Observable<any['']>;
  keyword = '';


  documentoH?: number;
  idC?: number;
  idLibro?: number;

  carreraEst?: string;
  fechaDespues?: string;
  fechaHoy?: string;


  boton: boolean = false;
  selectLib?: boolean = false;;
  selectLib2?: boolean;
  prestIn?: boolean;
  carEst?: boolean;




  constructor(private router: Router, private carreraService: CarreraService, private PrestamoService: prestamoService, private personaService: PersonaService, private libroServices: LibroService) { }

  ngOnInit(): void {
    let usuarioJSON = localStorage.getItem('persona') + "";
    this.bibliotecario = JSON.parse(usuarioJSON);
    Swal.fire({
      title: 'Escriba la cédula de la persona',
      text: 'La persona debe estar registrada en el sistema',
      input: 'text',
      inputPlaceholder: '',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (texto) => {
        if (texto.length == 10) {
          if (!this.validarSoloLetras(texto)) {
            this.buscarCed(texto);

            this.carreraService.getCarreras().subscribe(
              response => {
                this.carreras = response;
              }
            );
          } else {
            this.router.navigate(['/']);
            Swal.fire({
              title: '<strong>La cédula contiene letras</strong>',
              confirmButtonText: 'OK',
              confirmButtonColor: '#012844',
              icon: 'error',
            })
          }
        } else {
          this.router.navigate(['/']);
          Swal.fire({
            title: '<strong>La cédula debe contener 10 caracteres</strong>',
            confirmButtonText: 'OK',
            confirmButtonColor: '#012844',
            icon: 'error',
          })

        }

      },


    }
    )


  }


  onKeydownEvent(event: KeyboardEvent, buscar: string): void {
    this.selectLib2 = false;
    this.libroServices.buscarLibro(buscar).subscribe(
      reponse => {
        console.log(reponse)
        this.libros = reponse;
      })
  }

  seleccionarlibro(libro2: Libro) {
    this.libro = libro2;
    this.selectLib = true;
    this.selectLib2 = true;
  }

  otroLib() {
    this.libro = new Libro;
    this.libros = [];
    this.selectLib = false;
    this.selectLib2 = undefined;
  }

  validarSoloLetras(cadena: string): boolean {
    const patron = /^[A-Za-z]+$/;
    return patron.test(cadena);
  }

  carrera(cedula?: string) {
    if (cedula != undefined) {
      this.carreraService.carreraest(cedula).subscribe(
        respose => {
          this.carreraEst = respose.nombre;
        }
      );
    }
  }

  seleccionT(e: any) {
    this.idC = e.target.value;
  }

  seleccionD(e: any) {
    this.documentoH = e.target.value;
  }

  buscarCed(cedula: string) {
    this.personaService.listarxcedula(cedula).subscribe(
      response => {
        this.persona = response;
        if (this.persona.tipo == 1) {
          this.carrera(this.persona.cedula);
          this.carEst = true;
        } else {
          this.carEst = false;
        }
      },
      error => {
        Swal.fire({
          confirmButtonColor: '#012844',
          icon: 'warning',
          title: 'No encontrado',
          text: 'El usuario no esta registrado en el sistema de la biblioteca.'
        }),
          this.persona.cedula = "";
        this.router.navigate(['/']);
      }
    )
  }

  guardar() {
    this.prestamo.idSolicitante = this.persona;
    this.prestamo.libro = this.libro;
    this.prestamo.fechaFin = new Date(Date.now());
    this.prestamo.fechaDevolucion = new Date(Date.now());
    this.prestamo.estadoLibro = 1;
    this.prestamo.estadoPrestamo=1;
    if (this.persona.tipo == 1) {
      this.prestamo.tipoPrestamo = 1;
    } else {
      this.prestamo.tipoPrestamo = 2;
    }
    if (this.idC != undefined) {
      this.carreraService.obtenerCarreraId(this.idC).subscribe(
        response => {
          this.prestamo.carrera = response;
        }
      );
    }
    this.prestamo.documentoHabilitante = this.documentoH;
    this.prestamo.idEntrega = this.bibliotecario;
    console.log(this.prestamo)
    this.PrestamoService.create(this.prestamo).subscribe(
      response => {
        Swal.fire({
          confirmButtonColor: '#012844',
          icon: 'success',
          title: 'Prestamo Guardado',
          text: 'Se guardo correcatamente'
        })
        this.router.navigate(['/app-lista-solicitudes-pendientes']);
      },
      error => {
        console.log(error);
        Swal.fire({
          confirmButtonColor: '#012844',
          icon: 'error',
          title: 'No se pudo guardar el prestamo',
        })
      }
    );
  }

  sumarDiasExcluyendoFinesDeSemana(fecha: Date, dias: number): Date {
    const fechaAuxiliar = new Date(fecha.getTime()); // Clonar la fecha original

    for (let i = 0; i < dias; i++) {
      fechaAuxiliar.setDate(fechaAuxiliar.getDate() + 1); // Agregar un día

      // Verificar si es sábado o domingo
      if (fechaAuxiliar.getDay() === 6) { // 6 representa el sábado
        fechaAuxiliar.setDate(fechaAuxiliar.getDate() + 2); // Saltar al lunes
      } else if (fechaAuxiliar.getDay() === 0) { // 0 representa el domingo
        fechaAuxiliar.setDate(fechaAuxiliar.getDate() + 1); // Saltar al lunes
      }
    }

    return fechaAuxiliar;
  }

  prestInst() {
    const fecha = new Date(Date.now());
    this.fechaHoy = format(fecha, 'dd/MM/yyyy');
    this.prestamo.fechaEntrega = fecha;
    this.prestamo.fechaMaxima = fecha;
    this.prestIn = true;
    this.boton = true;
  }

  prestDomic() {
    const fecha = new Date(Date.now());
    this.fechaHoy = format(fecha, 'dd/MM/yyyy');
    this.prestamo.fechaEntrega = fecha;
    this.prestamo.fechaMaxima = this.sumarDiasExcluyendoFinesDeSemana(fecha, 5);
    this.fechaDespues = format(this.prestamo.fechaMaxima, 'dd/MM/yyyy');
    this.prestIn = false;
    this.boton = true;
  }
}
