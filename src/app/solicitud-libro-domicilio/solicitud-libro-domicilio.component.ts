import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Prestamo } from '../models/Prestamo';
import { CarreraService } from '../services/carrera.service';
import { Carrera } from '../models/Carrera';
import Swal from 'sweetalert2';
import { prestamoService } from '../services/prestamo.service';
import { Persona } from '../models/Persona';
import { Router } from '@angular/router';

import { format } from 'date-fns';

@Component({
  selector: 'app-solicitud-libro-domicilio',
  templateUrl: './solicitud-libro-domicilio.component.html',
  styleUrls: ['./solicitud-libro-domicilio.component.css']
})
export class SolicitudLibroDomicilioComponent implements OnInit {
  prestamo: Prestamo = new Prestamo();
  persona: Persona = new Persona();
  carreraEstu:Carrera=new Carrera();
  reporteV: string = "";
  carreras: Carrera[] = [];
  mostrar: boolean = false;
  variable?: number;
  car: Carrera = new Carrera;
  idC?: number;
  documentoH?: number;
  names?: string[] = [];
  carreraEst?: string;
  carEst?: boolean;
  fechaHoy?: string;
  fechaDespues?:string;

  step = 1;
  totalSteps = 2;
  constructor(private router: Router, private carreraService: CarreraService, private PrestamoService: prestamoService) { }
  ngOnInit(): void {
    this.reporteV = localStorage.getItem('persona') + "";
    let usuarioJSON = localStorage.getItem('persona') + "";
    this.persona = JSON.parse(usuarioJSON);
    var solicitudJSONGET = localStorage.getItem("AceptarSolicitud");
    var solicitud = JSON.parse(solicitudJSONGET + "");
    this.prestamo = solicitud;
    console.log(this.prestamo);
    const fecha = new Date(Date.now());
    this.fechaHoy = format(fecha, 'dd/MM/yyyy');
    this.prestamo.fechaEntrega = fecha;
    this.prestamo.fechaMaxima = this.sumarDiasExcluyendoFinesDeSemana(fecha, 5);
    this.fechaDespues=format(this.prestamo.fechaMaxima, 'dd/MM/yyyy');

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
  retroceder1() {
    if (this.step > 1) {
      this.step--;
    }
  }
  seleccionT(e: any) {
    this.idC = e.target.value;
  }
  seleccionD(e: any) {
    this.documentoH = e.target.value;
  }



  guardar() {

    this.prestamo.estadoPrestamo = 2;
    this.prestamo.carrera = this.car;
    this.prestamo.idEntrega = this.persona;
      if (this.idC != undefined || this.documentoH != undefined || this.documentoH==0) {
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
  }


  activarDoc() {
    this.mostrar = true
  }
  desactivarDoc() {
    this.mostrar = false
  }
  
}
