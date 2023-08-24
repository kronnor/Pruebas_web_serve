import { Component, OnInit } from '@angular/core';
import { Prestamo } from '../models/Prestamo';
import { Carrera } from '../models/Carrera';
import { CarreraService } from '../services/carrera.service';
import { prestamoService } from '../services/prestamo.service';
import Swal from 'sweetalert2';
import { Persona } from '../models/Persona';
import { Router } from '@angular/router';
import { format } from 'date-fns';


@Component({
  selector: 'app-solicitud-libro',
  templateUrl: './solicitud-libro.component.html',
  styleUrls: ['./solicitud-libro.component.css']
})
export class SolicitudLibroComponent implements OnInit {
  prestamo: Prestamo = new Prestamo();
  prestamo2: Prestamo = new Prestamo();
  persona: Persona = new Persona();
  carreraEstu: Carrera = new Carrera();
  car: Carrera = new Carrera();

  carreras: Carrera[] = [];

  fechaDespues?: string;
  carreraEst?: string;
  reporteV: string = "";
  fechaHoy?: string;

  fecha?: Date;
  fechaMax?: Date;

  variable?: number
  documentoH?: number;
  idC?: number;

  mostrar: boolean = false;
  boton: boolean = false;
  modificar?: boolean;
  prestIn?: boolean;
  carEst?: boolean;


  step = 1;
  totalSteps = 2;



  constructor(private router: Router, private carreraService: CarreraService, private PrestamoService: prestamoService) { }

  ngOnInit(): void {
    let prestamoJSON = localStorage.getItem('prestamo') + "";
    this.prestamo2 = JSON.parse(prestamoJSON);

    if (this.prestamo2 == undefined || this.prestamo2 == null) {
      this.modificar = false;

      let usuarioJSON = localStorage.getItem('persona') + "";
      this.persona = JSON.parse(usuarioJSON);

      var solicitudJSONGET = localStorage.getItem("AceptarSolicitud");
      var solicitud = JSON.parse(solicitudJSONGET + "");

      this.prestamo = solicitud;

      const fecha = new Date(Date.now());
      this.fechaHoy = format(fecha, 'dd/MM/yyyy');
      this.prestamo.fechaEntrega = fecha;
      this.prestamo.fechaMaxima = fecha;
      console.log(this.prestamo)


      if (this.prestamo.idSolicitante?.cedula != undefined && this.prestamo.tipoPrestamo == 1) {
        this.carreraService.carreraest(this.prestamo.idSolicitante?.cedula).subscribe(
          respose => {
            this.carreraEst = respose.nombre;
            this.carreraEstu = respose;
            this.carEst = true;
          }
        );
      } else {
        this.carreraService.getCarreras().subscribe(
          response => {
            this.carreras = response;
            this.carEst = false;
          }
        );
      }
    } else {
      this.modificar = true;

      if (this.prestamo2.idSolicitante?.cedula != undefined && this.prestamo2.tipoPrestamo == 1) {
        this.carreraService.carreraest(this.prestamo2.idSolicitante?.cedula).subscribe(
          respose => {
            this.carreraEst = respose.nombre;
            this.carEst = true;
          }
        );
      } else {
        this.carreraService.getCarreras().subscribe(
          response => {
            this.carreras = response;
            this.carEst = false;
          }
        );
      }
    }

  }

  retroceder1() {
    if (this.step > 1) {
      this.step--;
    }
  }


  avanzar1() {
    if (this.idC != undefined || this.carreraEst != undefined) {
      if (this.step < this.totalSteps) {
        this.step++;
      }
    } else {
      Swal.fire({
        confirmButtonColor: '#012844',
        icon: 'warning',
        title: 'Ups...',
        text: 'Seleccione una Carrera'
      })
    }
  }

  avanzar() {
    if (this.step < this.totalSteps) {
      this.step++;
    }
  }

  seleccionT(e: any) {
    this.idC = e.target.value;
  }

  seleccionD(e: any) {
    this.documentoH = e.target.value;
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
    this.fecha = new Date(Date.now());
    this.fechaHoy = format(this.fecha, 'dd/MM/yyyy');
    this.prestIn = true;
    this.boton = true;
  }

  prestDomic() {
    this.fecha = new Date(Date.now());
    this.fechaHoy = format(this.fecha, 'dd/MM/yyyy');
    this.fechaMax = this.sumarDiasExcluyendoFinesDeSemana(this.fecha, 5);
    this.fechaDespues = format(this.fechaMax, 'dd/MM/yyyy');
    this.prestIn = false;
    this.boton = true;
  }

  guardar() {
    
    this.prestamo.estadoPrestamo = 2;
    this.prestamo.carrera = this.car;
    this.prestamo.idEntrega = this.persona;
    if (this.prestamo.fechaEntrega == this.prestamo.fechaMaxima) {
      if (this.idC != undefined || this.documentoH != undefined || this.documentoH == 0) {
        this.prestamo.documentoHabilitante = this.documentoH;
        if (this.idC != undefined) {
          this.carreraService.obtenerCarreraId(this.idC).subscribe(
            response => {
              this.prestamo.carrera = response;
            }
          );
        }

        if (this.carreraEst != undefined) {
          this.prestamo.carrera = this.carreraEstu;
        }
        console.log(this.prestamo)
        this.PrestamoService.update(this.prestamo).subscribe(
          response => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '<strong>Guardado correctamente</strong>',
              showConfirmButton: false,
              timer: 1500
            })
            this.router.navigate(['/app-lista-solicitudes-pendientes']);
          }
        );
      } else {
        Swal.fire({
          confirmButtonColor: '#012844',
          icon: 'warning',
          title: 'Ups...',
          text: 'Seleccione un documento habilitante'
        })
      }
    } else {
      Swal.fire({
        confirmButtonColor: '#012844',
        icon: 'warning',
        title: 'Ups...',
        text: 'La fecha de devolucion debe ser hoy mismo'
      })
    }

  }

  guardar2() {
    if(this.prestIn==true){
      this.prestamo2.fechaEntrega = this.fecha;
      this.prestamo2.fechaMaxima = this.fecha;
    }else {
      this.prestamo2.fechaEntrega = this.fecha;
      if(this.fecha)
      this.prestamo2.fechaMaxima = this.sumarDiasExcluyendoFinesDeSemana(this.fecha, 5);
    }
    this.PrestamoService.update(this.prestamo2).subscribe(
      response => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '<strong>Guardado correctamente</strong>',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/app-lista-solicitudes-pendientes']);
      }
    );

  }





}
