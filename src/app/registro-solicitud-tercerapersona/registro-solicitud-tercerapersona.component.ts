import { Component } from '@angular/core';
import { Persona } from '../models/Persona';
import { Prestamo } from '../models/Prestamo';
import { Router } from '@angular/router';
import { Libro } from '../models/Libro';
import { prestamoService } from '../services/prestamo.service';
import { PersonaService } from '../services/persona.service';
import { LibroService } from '../services/libro.service';
import { terceroService } from '../services/tercero.service';
import { Observable } from 'rxjs';
import { Tercero } from '../models/Tercero';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { TerceroPrestamo } from '../models/TerceroPrestamo';

@Component({
  selector: 'app-registro-solicitud-tercerapersona',
  templateUrl: './registro-solicitud-tercerapersona.component.html',
  styleUrls: ['./registro-solicitud-tercerapersona.component.css']
})
export class RegistroSolicitudTercerapersonaComponent {
  tercero: Tercero = new Tercero();
  prestamo: Prestamo = new Prestamo();
  bibliotecario: Persona = new Persona();
  solicitante: Persona = new Persona();
  terceroPrestamo: TerceroPrestamo = new TerceroPrestamo();
  public dato!: Observable<any['']>;
  public keyword = 'nombre';

  documentoH?: number;
  fechaHoy?: string;
  fechaDespues?: string;
  boton: boolean = false;
  selectLib?: boolean = false;;
  tercerocrear?: boolean = false;;
  selectLib2?: boolean;
  libros: Libro[] = [];
  libro: Libro = new Libro();

  constructor(private TerceroServices: terceroService, private router: Router, private PrestamoService: prestamoService, private personaService: PersonaService, private libroServices: LibroService) { }

  ngOnInit(): void {
    let usuarioJSON = localStorage.getItem('persona') + "";
    this.bibliotecario = JSON.parse(usuarioJSON);
    this.obtenerAutor();
    const fecha = new Date(Date.now());
    this.fechaHoy = format(fecha, 'dd/MM/yyyy');
    this.prestamo.fechaEntrega = fecha;
    this.prestamo.fechaMaxima = fecha;
    this.prestamo.fechaFin = fecha;
    this.boton = true;
  }

  seleccionD(e: any) {
    this.documentoH = e.target.value;
  }

  obtenerAutor(): void {
    this.dato = this.libroServices.obtenerLibros();
    console.log(this.dato);
  }

  onKeydownEvent(event: KeyboardEvent, cedula: string): void {
    if (cedula.length == 10) {
      this.TerceroServices.terceroxcedula(cedula).subscribe({
        next: response => {
          if (response != null && response != undefined) {
            this.tercero = response;
            console.log(response);
            this.terceroPrestamo.tercero = response;
            this.tercerocrear = false;
          }
        },
        error: error => {
          console.log(error);
          if (error.status === 404) {
            this.tercero = new Tercero();
            this.tercero.cedula = cedula;
            this.tercerocrear = true;
          }
        }
      });
    }

  }


  onKeydownEvent2(event: KeyboardEvent, buscar: string): void {
    this.libros = [];
    this.selectLib2 = false;
    this.libroServices.buscarLibro(buscar).subscribe(
      response => {
        response.forEach(element => {
          if (element.disponibilidad == true) {
            this.libros.push(element);
          }
        });
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

  consultarID() {
  }

  crearTercero() {
    this.TerceroServices.create(this.tercero).subscribe(
      response => {
        this.terceroPrestamo.tercero = response,
          this.prestamo.libro = this.libro;
        this.prestamo.fechaDevolucion = undefined;
        this.prestamo.estadoLibro = 1;
        this.prestamo.estadoPrestamo = 2;
        this.prestamo.activo = true;
        this.prestamo.documentoHabilitante = this.documentoH;
        this.prestamo.idEntrega = this.bibliotecario;
        this.prestamo.tipoPrestamo = 3;
        this.PrestamoService.create(this.prestamo).subscribe(
          response => {
            this.terceroPrestamo.prestamo = response;
            console.log(this.terceroPrestamo);
            this.TerceroServices.createTerPres(this.terceroPrestamo).subscribe(
              response => {
                Swal.fire({
                  confirmButtonColor: '#012844',
                  icon: 'success',
                  title: 'Guardado Correctamente',
                })
                this.router.navigate(['/app-lista-solicitudes-terceros']);
              }
            );
          }
        );

      }
    );
  }

  crearPrestamo() {
    this.prestamo.libro = this.libro;
    this.prestamo.fechaDevolucion = undefined;
    this.prestamo.estadoLibro = 1;
    this.prestamo.estadoPrestamo = 2;
    this.prestamo.activo = true;
    this.prestamo.documentoHabilitante = this.documentoH;
    this.prestamo.idEntrega = this.bibliotecario;
    this.prestamo.tipoPrestamo = 3;
    this.PrestamoService.create(this.prestamo).subscribe(
      response => {
        this.terceroPrestamo.prestamo = response;
        this.crearPrestamoTercero();
      }
    );
  }

  crearPrestamoTercero() {
    this.terceroPrestamo.tercero = this.tercero;
    console.log(this.terceroPrestamo);
    this.TerceroServices.createTerPres(this.terceroPrestamo).subscribe(
      response => {
        Swal.fire({
          confirmButtonColor: '#012844',
          icon: 'success',
          title: 'Guardado Correctamente',
        })
        this.router.navigate(['/app-lista-solicitudes-terceros']);
      }
    );
  }

  guardar() {

    this.crearTercero();

  }
}
