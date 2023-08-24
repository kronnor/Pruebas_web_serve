import { Component, OnInit } from "@angular/core";
import { Persona } from "../models/Persona";
import { Sugerencia } from "../models/Sugerencia";
import { sugerenciaService } from "../services/sugerencia.service";
import { Carrera } from "../models/Carrera";
import { CarreraService } from "../services/carrera.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']

})
export class FooterComponent implements OnInit {
  sugerencia: Sugerencia = new Sugerencia();
  persona: Persona = new Persona();
  carrera: Carrera = new Carrera();
  carreraEst?: string;


  carreras: Carrera[] = [];
  carEst?: boolean;
  car: Carrera = new Carrera;
  idC?: number;



  constructor(private sugerenciaService: sugerenciaService, private CarreraService: CarreraService) { }

  ngOnInit() {
    let usuarioJSON = localStorage.getItem('persona') + "";
    this.persona = JSON.parse(usuarioJSON);
    console.log(this.persona);
    this.CarreraService.getCarreras().subscribe(
      response => {
        this.carreras = response;
        console.log
      }
    );
  }

  seleccionT(e: any) {
    this.idC = e.target.value;
    if(this.idC)
    this.CarreraService.obtenerCarreraId(this.idC).subscribe
    (
      (response:Carrera)=>{
        console.log(response);
        this.sugerencia.carrera=response})
  }


closeopopup(){
  this.displayStyle = "none";
}
  displayStyle = "none";

  openPopup() {
    this.displayStyle = "block";
  }
  
 
  GuardarSuger(){
    
    this.sugerencia.estado = true;
    this.sugerencia.fecha = new Date(Date.now());
    this.sugerencia.persona= this.persona
    
   
    console.log(this.sugerencia);
    this.sugerenciaService.create(this.sugerencia).subscribe({
     
     next: response=>{
      this.displayStyle = "none";
      Swal.fire(' Guardado',' Guardado con exito en el sistema','success');
     },
     error: error =>{
      console.log(error);
      if (error.status===400){
        Swal.fire({
          position:'center',
          icon:'error',
        })
      }
     }
     
      /*next: response=>{
        console.log(response);
        this.displayStyle = "none";
        Swal.fire(' Guardado',' Guardado con exito en el sistema','success');

      }, (error) => {
        console.log(error);
        Swal.fire('Error', 'error de guadado', 'error');
      }*/
  
  });
  }

}
