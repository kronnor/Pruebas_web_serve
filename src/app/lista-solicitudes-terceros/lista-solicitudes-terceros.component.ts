import { Component } from '@angular/core';
import { terceroService } from '../services/tercero.service';
import { TerceroPrestamo } from '../models/TerceroPrestamo';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-solicitudes-terceros',
  templateUrl: './lista-solicitudes-terceros.component.html',
  styleUrls: ['./lista-solicitudes-terceros.component.css']
})
export class ListaSolicitudesTercerosComponent {
  listaterceroP: TerceroPrestamo[] = [];
  listaterceroPb: TerceroPrestamo[] = [];

  prestados?: boolean;
  recibidos?: boolean;
  nodevuelto?: boolean;
  restituido?: boolean;
  destruido?: boolean;
  buscar?: boolean=false;
  buscarv?:boolean
  constructor(private TerceroService: terceroService, private router: Router) { }

  ngOnInit(): void {
    this.listaterceroPb = [];
    this.listaPrestados();
  }

  listaPrestados() {
    this.listaterceroP = [];
    this.TerceroService.obtenerTerPres().subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.prestamo?.estadoPrestamo == 2) {
              this.listaterceroP.push(element);
            }
          });
        }
      }
    )
    this.prestados = true;
    this.recibidos = false;
    this.nodevuelto = false;
    this.restituido = false;
    this.destruido = false;
    this.buscar = false;
  }

  listaRecibidos() {
    this.listaterceroP = [];
    this.TerceroService.obtenerTerPres().subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.prestamo?.estadoPrestamo == 3) {
              this.listaterceroP.push(element);
            }
          });
        }
      }
    )
    this.prestados = false;
    this.recibidos = true;
    this.nodevuelto = false;
    this.restituido = false;
    this.destruido = false;
    this.buscar = false;
  }

  listaNoDevueltos() {
    this.listaterceroP = [];
    this.TerceroService.obtenerTerPres().subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.prestamo?.estadoPrestamo == 5) {
              this.listaterceroP.push(element);
            }
          });
        }
      }
    )
    this.prestados = false;
    this.recibidos = false;
    this.nodevuelto = true;
    this.restituido = false;
    this.destruido = false;
    this.buscar = false;
  }

  listaRestituidos() {
    this.listaterceroP = [];
    this.TerceroService.obtenerTerPres().subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.prestamo?.estadoPrestamo == 6) {
              this.listaterceroP.push(element);
            }
          });
        }
      }
    )
    this.prestados = false;
    this.recibidos = false;
    this.nodevuelto = false;
    this.restituido = true;
    this.destruido = false;
    this.buscar = false;
  }

  listaDestruidos() {
    this.listaterceroP = [];
    this.TerceroService.obtenerTerPres().subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.prestamo?.estadoPrestamo == 4) {
              this.listaterceroP.push(element);
            }
          });
        }
      }
    )
    this.prestados = false;
    this.recibidos = false;
    this.nodevuelto = false;
    this.restituido = false;
    this.destruido = true;
    this.buscar = false;
  }

  devolver(prestamoTercero: TerceroPrestamo) {
    const objetoString = JSON.stringify(prestamoTercero);
    localStorage.setItem("SolicitudTercero", objetoString);
    this.router.navigate(['/app-devolver-libro-tercero']);
  }

  devolucionR(prestamo: TerceroPrestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("SolicitudTercero", objetoString);
    localStorage.setItem("estadoR", 6 + "");
    this.router.navigate(['/app-devolver-libro-tercero']);
  }

  solicitudCompleta(prestamo: TerceroPrestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("SolicitudTercero", objetoString);
    localStorage.setItem("solicitudCompleta", 1 + "");
    this.router.navigate(['/app-devolver-libro-tercero']);
  }

  getNombreEstado(numeroEstado: number | undefined): string {
    let nombreEstado = 'Desconocido'; // Valor predeterminado si el número del estado es undefined

    if (numeroEstado !== undefined) {
      switch (numeroEstado) {
        case 1:
          nombreEstado = 'Solicitado';
          break;
        case 2:
          nombreEstado = 'Prestado';
          break;
        case 3:
          nombreEstado = 'Recibido';
          break;
        case 4:
          nombreEstado = 'Libro Destruido';
          break;
        case 5:
          nombreEstado = 'No Devuelto';
          break;
        case 6:
          nombreEstado = 'Restituido';
          break;
        // Agrega más casos según tus necesidades
      }
    }

    return nombreEstado;
  }

  onKeydownEvent(event: KeyboardEvent, buscar2: String): void {
    this.listaterceroPb=[]
    this.prestados = false;
    this.recibidos = false;
    this.nodevuelto = false;
    this.restituido = false;
    this.destruido = false;
    //buscar
    this.buscar = true;

    if (buscar2 == "") {
      this.ngOnInit();
    } else if (buscar2.length == 10) {

      this.TerceroService.terceroPrestxcedula(buscar2+"").subscribe(
        response => {
          if (response.length == 0) {
            Swal.fire({
              title: '<strong>Prestamo no encontrado</strong>',
              confirmButtonText: 'error',
              confirmButtonColor: '#012844',
              icon: 'error',
            })
            this.ngOnInit();
          } else {
            if(response!=null){
              this.listaterceroPb=response
            }
          }
        }
      );
    }
  }
}
