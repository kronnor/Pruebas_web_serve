import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Etiqueta } from 'src/app/models/Etiqueta';
import { Libro } from 'src/app/models/Libro';
import { LibroEtiqueta } from 'src/app/models/LibroEtiqueta';
import { LibroService } from 'src/app/services/libro.service';
import { ListasService } from 'src/app/services/listas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reg-etiquetas',
  templateUrl: './reg-etiquetas.component.html',
  styleUrls: ['./reg-etiquetas.component.css']
})
export class RegEtiquetasComponent implements OnInit {

  titulolibro?: string
  idlibro?: number
  idetiqueta?: number
  etiquetas: Etiqueta[]=[]
  public libro: Libro = new Libro();
  public etiqueta: Etiqueta= new Etiqueta();
  public etiquetaL: LibroEtiqueta[] = []
  public libroeti: LibroEtiqueta= new LibroEtiqueta();

  ngOnInit(): void {
    
    const titulo = window.localStorage.getItem('titulolibro')
    if (titulo) {
      this.titulolibro = titulo
    }
    console.log(this.titulolibro);
   
    
    


    const id = window.localStorage.getItem('idlibro')
    console.log(id);
    

    if (id) {
      this.idlibro = parseInt(id)
      this.listaService.buscarEtiquetas(this.idlibro).subscribe(
        e => this.etiquetaL = e
      )

      this.libroService.buscarLibro1(this.idlibro).subscribe(
        l => this.libro = l
      )

      
    }

    console.log(this.libro);
    

    this.listaService.obteneEtiquetas().subscribe(
      eti=> this.etiquetas = eti
    )
  }

  constructor(
    private libroService: LibroService,
    private listaService: ListasService,
    private router: Router
  ) {
   
  }

  

  ngOnDestroy() {
    localStorage.removeItem('idlibro');
    localStorage.removeItem('titulolibro');
  }

  obteneretiqueta(e:any){
    this.idetiqueta = e.target.value
    if(this.idetiqueta){
      this.listaService.SeleccionarEti(this.idetiqueta).subscribe(
          e => this.etiqueta=e
        )
        console.log(this.etiqueta);
        
    }

  }

  guardar() {
    this.libroeti.libro = this.libro
    this.libroeti.etiqueta = this.etiqueta
    this.listaService.createEtiqueta(this.libroeti).subscribe(
      (response: any)=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '<strong>Has registrado una Etiqueta</strong>',
          showConfirmButton: false,
          timer: 1500
        })
        
        setTimeout(() => {
          this.router.navigate(['app-registro-etiquetas']);
          const id = window.localStorage.getItem('idlibro')
          if (id) {
            this.idlibro = parseInt(id)
            this.listaService.buscarEtiquetas(this.idlibro).subscribe(
              e => this.etiquetaL = e
            )
          }
          //location.reload();
        }, 1000);
      }
    )
  }

  salir(){
    
    this.router.navigate(['app-vista-registro-new']);
  }

  eliminarEti(id:number){
    this.listaService.eliminarEtiqueta(id).subscribe(
      Response=>{
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: '<strong>Se a eliminado una Etiqueta</strong>',
          showConfirmButton: false,
          timer: 1500
        })
        
        setTimeout(() => {
          this.etiquetaL.splice(0, this.etiquetaL.length)
          this.router.navigate(['app-registro-etiquetas']);
          const id = window.localStorage.getItem('idlibro')
          if (id) {
            this.idlibro = parseInt(id)
            this.listaService.buscarEtiquetas(this.idlibro).subscribe(
              e => this.etiquetaL = e
            )
          }
          //location.reload();
        }, 1000);
      }
    )
  }

}
