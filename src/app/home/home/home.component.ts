import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Libro } from 'src/app/models/Libro';
import { Persona } from 'src/app/models/Persona';
import { LibroService } from 'src/app/services/libro.service';
import { Prestamo } from 'src/app/models/Prestamo';
import { prestamoService } from 'src/app/services/prestamo.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import * as QRCode from 'qrcode';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  prestamos: Prestamo = new Prestamo();
  persona: Persona = new Persona();
  libros: Libro[] = [];
  reporteV: string = "";
  datos: string = "";
  datoslibro: string = "";
  buscar: boolean = true;
  normal: boolean = false;
  mostrar: boolean=false;

  constructor(private prestamoService: prestamoService, private libroService: LibroService, private router: Router, private router1: Router, private notificacionesService: NotificacionesService) { }

  ngOnInit(): void {
    this.libroService.obtenerLibros().subscribe(
      libro => this.libros = libro
    );
    this.buscar = false;
    this.normal = true;
    let usuarioJSON = localStorage.getItem('persona') + "";
    this.persona = JSON.parse(usuarioJSON);
    if (this.persona.tipo == 3 || this.persona.tipo == 4) {
      this.mostrar = true;
    }else{
      this.mostrar=false;
    }

  }


  ///////////////////////////qr
  generateQRCode(registroId: string) {
    const canvas = document.querySelector('canvas');
    QRCode.toCanvas(canvas, registroId, {
      errorCorrectionLevel: 'H', // Nivel de corrección de errores alto para mayor resiliencia
      margin: 1,
      width: 200,
      color: {
        dark: '#0067CF', // Color de los módulos oscuros
        light: '#f8f8f8' // Color de los módulos claros

      },

    }, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }

  onKeydownEvent(event: KeyboardEvent, titulo: String): void {
    if (titulo == "") {
      this.ngOnInit();
    }
  }

  buscarLibxNomb(nombre: String) {
    this.normal = false;

    this.libroService.buscarLibro(nombre).subscribe({
      next: libro => {
        this.libros = libro
        this.buscar = true;
      },
      error: error => {
        if (error.status === 404) {
          Swal.fire({
            confirmButtonColor: '#012844',
            icon: 'warning',
            title: 'Ups...',
            text: 'No se encontro ningun libro'
          })
          this.ngOnInit();
        }
      }
    });
  }


  SolicitarLibro(paginacrear: Libro) {
    if (this.persona.calificacion == 0 && this.persona.activo == false) {
      Swal.fire({
        confirmButtonColor: '#012844',
        icon: 'error',
        title: 'Solicitud Denegada',
      })
    } else {
      if (this.persona == null) {
        Swal.fire({
          confirmButtonColor: '#012844',
          icon: 'warning',
          title: 'Ups...',
          text: '¡Parece que no has iniciado sesion!'

        })
        this.router.navigate(['/']);
      } else {
        this.confirmar(paginacrear);
        this.generateQRCode(paginacrear.id + "");
      }
    }
  }

  cerrarpopup() {
    var overlay = document.getElementById('overlay');
    overlay?.classList.remove('active');
  }



  public crearPrestamo(paginacrear: any) {
    if (paginacrear.disponibilidad == true) {
      this.prestamos.libro = paginacrear
      this.prestamos.activo = true;
      this.prestamos.idSolicitante = this.persona
      this.prestamos.estadoLibro = 1
      this.prestamos.estadoPrestamo = 1
      this.prestamos.documentoHabilitante = 0;
      this.prestamos.fechaFin = new Date(Date.now());
      this.prestamos.fechaMaxima = new Date(Date.now());
      this.prestamos.tipoPrestamo = 1
      console.log(this.prestamos)

      this.prestamoService.create(this.prestamos).subscribe(
        response => {
          this.datos = response.idSolicitante?.nombres + "", this.datoslibro = response.libro?.titulo + ""
          var overlay = document.getElementById('overlay');
          overlay?.classList.add('active');

          this.notificar();
          console.log(response);
          this.ngOnInit();
        }
      );
    }
  }
  public notificar() {
    this.notificacionesService.getNotificacionBibliotecario().subscribe(
      response => (console.log(response), this.notificacionesService.notificationlista = response, console.log(this.notificacionesService.notificationlista))
    )
  }
  confirmar(paginacrear: Libro) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Confirme la solicitud?',
      text: "Este paso es irreversible esta seguro!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, acepto!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearPrestamo(paginacrear);
        swalWithBootstrapButtons.fire(
          'Confirmado!',



        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado!'


        )
      }
    })
  }

  libroCompleto(libro: Libro) {
    const objetoString = JSON.stringify(libro);
    localStorage.setItem("LibroCompleto", objetoString);
    this.router.navigate(['/app-libro-completo']);
  }
}