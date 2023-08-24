import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prestamo } from '../models/Prestamo';
import Swal from 'sweetalert2';
import { prestamoService } from '../services/prestamo.service';
import { Notificacion } from '../models/Notificacion';
import { NotificacionesService } from '../services/notificaciones.service';
import { terceroService } from '../services/tercero.service';
import { TerceroPrestamo } from '../models/TerceroPrestamo';
import { Persona } from '../models/Persona';
import { Carrera } from '../models/Carrera';

@Component({
  selector: 'app-lista-solicitudes-pendientes',
  templateUrl: './lista-solicitudes-pendientes.component.html',
  styleUrls: ['./lista-solicitudes-pendientes.component.css']
})
export class ListaSolicitudesPendientesComponent implements OnInit {
  listaprestamos: Prestamo[] = [];
  listaTercerosPrest: TerceroPrestamo[] = [];
  notificacion: Notificacion = new Notificacion();
  persona: Persona = new Persona();
  //Tablas
  pendientes?: boolean;
  prestados?: boolean;
  recibidos?: boolean;
  nodevuelto?: boolean;
  restituido?: boolean;
  destruido?: boolean;
  buscar?: boolean;
  datosNotificacionP: string = ""

  constructor(private TerceroService: terceroService, private notificacionesService: NotificacionesService, private prestamoService: prestamoService, private router: Router) { }

  ngOnInit(): void {
    this.listaPendientes();

    let notificacionDato = localStorage.getItem('Dato') + "";
    this.notificacion = JSON.parse(notificacionDato);

    let usuarioJSON = localStorage.getItem('persona') + "";
    this.persona = JSON.parse(usuarioJSON);

    if (this.notificacion != null) {
      this.datosNotificacionP = this.notificacion.prestamo?.idSolicitante?.cedula + ""
      this.editarNotificacion(this.notificacion);
      console.log(this.notificacion)
    } else {
      this.datosNotificacionP = ""
    }



    localStorage.removeItem('prestamo');
    localStorage.removeItem('solicitudCompleta');
    localStorage.removeItem('estadoR');
    localStorage.removeItem('Dato');



  }
  editarNotificacion(notificacion: Notificacion) {
    notificacion.visto = true
    this.notificacionesService.updateVisto(notificacion).subscribe(
      response => (
        console.log(response)
      )
    )
  }

  aceptarDomicilio(prestamo: Prestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("AceptarSolicitud", objetoString);
    this.router.navigate(['/app-solicitud-libro-domicilio']);
  }

  aceptar(prestamo: Prestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("AceptarSolicitud", objetoString);
    this.router.navigate(['/app-solicitud-libro']);
  }


  rechazar(prestamo: Prestamo) {
    prestamo.estadoPrestamo = 7;
    prestamo.idEntrega = this.persona;
    console.log(this.persona)
    this.prestamoService.update(prestamo).subscribe(
      response => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '<strong>Solicitud Rechazada Correctamente</strong>',
          showConfirmButton: false,
          timer: 1500
        });
        this.ngOnInit();
      }
    );

  }

  devolucion(prestamo: Prestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("AceptarSolicitud", objetoString);
    this.router.navigate(['/app-devolver-libro']);
  }
  devolucionR(prestamo: Prestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("AceptarSolicitud", objetoString);
    this.router.navigate(['/app-devolver-libro']);
    localStorage.setItem("estadoR", 6 + "");
    this.router.navigate(['/app-devolver-libro']);
  }

  solicitudCompleta(prestamo: Prestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("AceptarSolicitud", objetoString);
    this.router.navigate(['/app-devolver-libro']);
    localStorage.setItem("solicitudCompleta", 1 + "");
    this.router.navigate(['/app-devolver-libro']);
  }


  listaPendientes(): void {
    this.listaprestamos = [];

    this.prestamoService.listarxestado(1).subscribe(
      response => {
        if (response != null) {
          this.listaprestamos = response;
        }
      }

    );

    this.pendientes = true;
    this.prestados = false;
    this.recibidos = false;
    this.nodevuelto = false;
    this.restituido = false;
    this.destruido = false;
    this.buscar = false;
  }

  listaPrestados(): void {
    this.listaprestamos = [];
    this.prestamoService.listarxestado(2).subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.tipoPrestamo != 3) {
              this.listaprestamos.push(element);
            }
          });
        }
      }

    );
    this.pendientes = false;
    this.prestados = true;
    this.recibidos = false;
    this.nodevuelto = false;
    this.restituido = false;
    this.destruido = false;
    this.buscar = false;
  }
  listaRecibidos(): void {
    this.listaprestamos = [];
    this.prestamoService.listarxestado(3).subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.tipoPrestamo != 3) {
              this.listaprestamos.push(element);
            }
          });
        }
      }

    );
    this.pendientes = false;
    this.prestados = false;
    this.recibidos = true;
    this.nodevuelto = false;
    this.restituido = false;
    this.destruido = false;
    this.buscar = false;
  }
  listaNoDevueltos(): void {
    this.listaprestamos = [];
    this.prestamoService.listarxestado(5).subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.tipoPrestamo != 3) {
              this.listaprestamos.push(element);
            }
          });
        }
      }

    );
    this.pendientes = false;
    this.prestados = false;
    this.recibidos = false;
    this.destruido = false;
    this.nodevuelto = true;
    this.restituido = false;
    this.buscar = false;

  }
  listaRestituidos(): void {
    this.listaprestamos = [];
    this.prestamoService.listarxestado(6).subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.tipoPrestamo != 3) {
              this.listaprestamos.push(element);
            }
          });
        }
      }

    );
    this.pendientes = false;
    this.prestados = false;
    this.recibidos = false;
    this.nodevuelto = false;
    this.destruido = false;
    this.restituido = true;
    this.buscar = false;
  }
  listaDestruidos(): void {
    this.listaprestamos = [];
    this.prestamoService.listarxestado(4).subscribe(
      response => {
        if (response != null) {
          response.forEach(element => {
            if (element.tipoPrestamo != 3) {
              this.listaprestamos.push(element);
            }
          });
        }
      }

    );
    this.pendientes = false;
    this.prestados = false;
    this.recibidos = false;
    this.nodevuelto = false;
    this.destruido = true;
    this.restituido = false;
    this.buscar = false;
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

  modificar(prestamo: Prestamo) {
    const objetoString = JSON.stringify(prestamo);
    localStorage.setItem("prestamo", objetoString);
    this.router.navigate(['/app-solicitud-libro']);
  }

  onKeydownEvent(event: KeyboardEvent, buscar2: String): void {
    this.pendientes = false;
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

      this.prestamoService.buscarPrestamo(buscar2).subscribe(
        response => {
          console.log(response);
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
              response.forEach(element => {
                if (element.tipoPrestamo != 3) {
                  this.listaprestamos.push(element);
                }
              });
            }
          }
        }
      );
    }
  }

}