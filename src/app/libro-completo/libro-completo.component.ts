import { Component } from '@angular/core';
import { Libro } from '../models/Libro';
import { Autor_Libro } from '../models/Autor_Libro';
import { ListasService } from '../services/listas.service';
import { Router } from '@angular/router';
import { Observable, catchError, map, startWith, throwError, filter } from 'rxjs';
import { Autor } from '../models/Autor';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-libro-completo',
  templateUrl: './libro-completo.component.html',
  styleUrls: ['./libro-completo.component.css']
})
export class LibroCompletoComponent {
  libro: Libro = new Libro();
  autor: Autor = new Autor;
  public previsualizacion?: string
  autores_libros: Autor_Libro = new Autor_Libro();

  private url= environment.rooturl
  urlI?:string;
  imagen?: File;
  step = 1;
  totalSteps = 4;

  disp?: string;
  isDisabled: boolean = true;

  public keyword = 'nombre';

  constructor(private listaservice: ListasService,  private sanitizer: DomSanitizer,private router: Router, private ListaT: ListasService) { }

  ngOnInit() {
    let usuarioJSON = localStorage.getItem('LibroCompleto') + "";
    this.libro = JSON.parse(usuarioJSON);
    if (this.libro.disponibilidad == true) {
      this.disp = "Disponible";
    } else {
      this.disp = "No disponible"
    }
    this.urlI=this.url+this.libro.urlImagen
    this.listaservice.obtenerAutor_Libro().subscribe(
      response => {
        console.log(response);
        if (response != null || response != undefined) {
          response.forEach(element => {
            if (element.libro?.id == this.libro.id) {
              this.autores_libros = element;
            }
          })
        }
      }
    );
  }

  retroceder1() {
    if (this.step > 1) {
      this.step--;
    }
  }


  avanzar1() {
    if (this.step < this.totalSteps) {
      this.step++;
    }
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
  
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
  
    } catch (e) {
      console.log("Error al Subir Imagen")
    }
  })

  getNombreEstadoLibro2(numeroEstado: number | undefined): string {
    let nombreEstado = 'Desconocido'; // Valor predeterminado si el número del estado es undefined

    if (numeroEstado !== undefined) {
      switch (numeroEstado) {
        case 1:
          nombreEstado = 'Nuevo';
          break;
        case 2:
          nombreEstado = 'Bueno';
          break;
        case 3:
          nombreEstado = 'Regular';
          break;
        case 4:
          nombreEstado = 'Malo';
          break;
        case 5:
          nombreEstado = 'No Utilizable';
          break;
        // Agrega más casos según tus necesidades
      }
    }

    return nombreEstado;
  }
  editar() {
    console.log("Entroooo")
    this.isDisabled = false;
    this.ngOnInit();
  }

  aceptar() {
    this.router.navigate(['/']);
  }

  agregarEtiqueta() {
    if (this.libro.id != undefined && this.libro.titulo) {
      window.localStorage.setItem('idlibro', this.libro.id.toString());
      localStorage.setItem('titulolibro',this.libro.titulo)
      this.router.navigate(['/app-registro-etiquetas']);
    }
  }

  public dato!: Observable<any['']>;


  obtenerAutor(): void {
    this.dato = this.ListaT.obtenerAutores();
    console.log(this.dato + "Holii");


  }


  selectedAutor: any;

  capturarAutor(posicion: any) {
    console.log(posicion);
    if (posicion && posicion.nombre) {
      this.autor = posicion;

      //this.autorlibro.autor = this.autor

    }

  }

  capturarImagen(event: any): any {
    const archivocapturado = event.target.files[0]
    this.imagen = event.target.files[0]
    this.extraerBase64(archivocapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
    })

  }
}
