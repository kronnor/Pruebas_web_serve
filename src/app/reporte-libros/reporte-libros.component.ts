import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CarreraService } from '../services/carrera.service';
import { Prestamo } from '../models/Prestamo';
import { Carrera } from '../models/Carrera';
import { prestamoService } from '../services/prestamo.service';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import { CarreraPrestamo } from '../models/CarreraPrestamo';
import { Libro } from '../models/Libro';


@Component({
  selector: 'app-reporte-libros',
  templateUrl: './reporte-libros.component.html',
  styleUrls: ['./reporte-libros.component.css']
})
export class ReporteLibrosComponent implements OnInit {
  listaprestamos: Prestamo[] = [];
  listaprestamosest: Prestamo[] = [];
  listaprestamosdoc: Prestamo[] = [];
  carreras: Carrera[] = [];
  prestamosTodos: Prestamo[] = [];
  libros: Libro[] = [];

  totalEst: number = 0;
  totalDoc: number = 0;
  total: number = 0;


  startFecha: string = "";
  endFecha: string = "";
  selectedRace: string = "";
  filteredList: any[] = [];

  todos?: boolean;
  idC?: number;
  totalEstudiantesTipo1 = 0;
  totalDocentesTipo2 = 0;


  carrerasPrestamo: CarreraPrestamo[] = [];

  constructor(private listCarrera: CarreraService, private prestamoService: prestamoService, private router: Router) { }


  ngOnInit(): void {
    this.getCarrera();
    this.popPup();
    this.prestamoService.getPrestamos().subscribe(response => {
      this.listaprestamos = response;
    })
  }

  calcularTotalPrestamosTipo(prestamos: Prestamo[], tipo: number): number {
    return prestamos.filter((prestamo) => prestamo.tipoPrestamo === tipo).length;
  }



  getCarrera() {
    this.listCarrera.getCarreras().subscribe(
      carre => this.carreras = carre);
  }


  buscars(start: string, end: string): void {
    this.prestamosTodos = [];
    if (this.todos == true) {

      this.prestamoService.prestamoconcarrera(start, end, 0).subscribe((data) => {
        this.prestamosTodos = data;


        this.listCarrera.getCarreras().subscribe((carreras) => {
          this.carrerasPrestamo = [];

          carreras.forEach((carrera) => {
            this.totalEst = 0;
            this.totalDoc = 0;
            this.total = 0;
            this.prestamosTodos.forEach(
              (prestamo) => {
                if (carrera.id === prestamo.carrera?.id) {
                  if (prestamo.tipoPrestamo === 1) {
                    this.totalEst = this.totalEst + 1;
                  } else if (prestamo.tipoPrestamo === 2) {
                    this.totalDoc = this.totalDoc + 1;
                  }
                }
              })
            this.total = this.totalEst + this.totalDoc;
            const totalEstudiantesTipo1 = this.totalEst;
            const totalDocentesTipo2 = this.totalDoc;
            const totalCarrera = this.total;
            // Agregar los datos a la lista de carrerasPrestamo
            this.carrerasPrestamo.push({
              carrera,
              totalEstudiantesTipo1,
              totalDocentesTipo2,
              totalCarrera,
            });
            this.libros = this.obtenerLibrosSinRepetir(this.prestamosTodos);
          })
        });
      });

    } else {
      this.listCarrera.getCarreras().subscribe((carreras) => {
        this.carrerasPrestamo = [];

        // Realizar las consultas por cada carrera
        carreras.forEach((carrera) => {
          const id = carrera.id; // Suponiendo que el objeto Carrera tiene un campo 'id'
          const inicio = start; // Fecha de inicio que desees
          const fin = end; // Fecha de fin que desees

          // Llamada al servicio para obtener los datos de estudiantes y docentes
          if (id)
            this.prestamoService.prestamoconcarrera(inicio, fin, id).subscribe((data) => {
              if (data != null) {
                data.forEach((prestamo) => {
                  if (prestamo.tipoPrestamo === 1 || prestamo.tipoPrestamo === 2) {
                    this.prestamosTodos.push(prestamo);
                  }
                });





                const prestamos = data;
                const totalEstudiantesTipo1 = this.calcularTotalPrestamosTipo(prestamos, 1);
                const totalDocentesTipo2 = this.calcularTotalPrestamosTipo(prestamos, 2);
                const totalCarrera = prestamos.length;

                // Agregar los datos a la lista de carrerasPrestamo
                this.carrerasPrestamo.push({
                  carrera,
                  totalEstudiantesTipo1,
                  totalDocentesTipo2,
                  totalCarrera,
                });
                this.libros = this.obtenerLibrosSinRepetir(this.prestamosTodos);
              }
            });
        });
      });

    }
  }


  obtenerLibrosSinRepetir(prestamos: Prestamo[]): Libro[] {
    const librosSinRepetir: Libro[] = [];
    const librosIdsVistos = new Set<number>();

    prestamos.forEach((prestamo) => {
      const libroId = prestamo.libro?.id;
      if (prestamo.tipoPrestamo === 1 || prestamo.tipoPrestamo === 2) {
        if (libroId && !librosIdsVistos.has(libroId)) {
          librosIdsVistos.add(libroId);
          librosSinRepetir.push(prestamo.libro!);
        }
      }
    });

    return librosSinRepetir;
  }



  filter(e: Event) {
    this.selectedRace = (e.target as HTMLInputElement).value;
    if (this.selectedRace === "All") {
      this.todos = true;
    } else {
      this.idC = parseInt(this.selectedRace);
      this.todos = false;
    }
  }

  getLibroTitulo(prestamo: any): string {
    return prestamo.libro?.titulo || "";
  }


  popPup() {
    const welcomeMessage = "¿Estás seguro de consultar?";
    const titleColor = "#007bff";

    Swal.fire({
      icon: 'question',
      title: `<span style="color: ${titleColor}; font-size: 24px;">${welcomeMessage}</span>`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal2-popup-custom',
        icon: 'swal2-icon-custom',
        confirmButton: 'swal2-button-custom swal2-button-confirm',
        cancelButton: 'swal2-button-custom swal2-button-cancel'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          this.redirectToConsultarButton();
        }, 100);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/']);
      }
    });
  }

  redirectToConsultarButton() {
    const consultarButton = document.getElementById('consultarButton') as HTMLButtonElement;
    if (consultarButton) {
      consultarButton.click();
    }
  }



  downloadPDF() {

    const imageUrl = 'data:image/jpeg;base64,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';
    const encodedUrl = encodeURIComponent(imageUrl);

    // Crea un nuevo documento jspdf
    const doc = new jspdf();

    // Agrega un título al documento
    const title = "INSTITUTO UNIVERSITARIO DEL AZUAY";
    const fontSizeTitle = 16;
    const titleX = 105;

    doc.setFontSize(fontSizeTitle);
    doc.setTextColor("#023b76");
    doc.setFont('bold');
    doc.text(title, titleX, 50, { align: "center" });

    // Agrega Fecha
    const date = this.DateNow();
    const titleXx = 131;
    const fontSizeDate = 12;

    doc.setFontSize(fontSizeDate);
    doc.text(date, titleXx, 60, { align: "left" });

    // Carga la imagen desde la URL
    doc.addImage(encodedUrl, 'PNG', 90, 10, 30, 30);


    

    // Preparar los datos para la tabla del PDF
    const tableData1 = [];
    const tableData2 = [];
    const rows = this.carrerasPrestamo;
    const rows1 = this.libros;

    for (const prestamo of rows) {
      const rowData1 = [
        { content: prestamo.carrera?.nombre, styles: { halign: 'center' } },
        { content: prestamo.totalDocentesTipo2, styles: { halign: 'center' } },
        { content: prestamo.totalEstudiantesTipo1, styles: { halign: 'center' } },
        { content: prestamo.totalCarrera, styles: { halign: 'center' } },
      ];
      tableData1.push(rowData1);
    }
    for (const libro of rows1) {
      const rowData1 = [
        { content: libro.titulo, styles: { halign: 'center' } },
      ];
      tableData2.push(rowData1);
    }


    // Generar la primera tabla
    (doc as any).autoTable({
      tableWidth: 'auto',
      startY: 65,
      head: [['Carrera', 'Docentes', 'Estudiantes', 'Total']],
      body: tableData1,
    });
    // Obtener la posición vertical final de la primera tabla
    const lastAutoTable = (doc as any).lastAutoTable;
    const startYTable2 = lastAutoTable.finalY + 10; // Puedes ajustar el espaciado entre las tablas si lo deseas

    // Generar la segunda tabla
    (doc as any).autoTable({
      tableWidth: 'auto',
      startY: startYTable2, // Ajusta la posición vertical para la segunda tabla según tus necesidades
      head: [['Titulos de los Libros']],
      body: tableData2,
    });

// Después de generar la segunda tabla

// Obtener la posición vertical final de la segunda tabla
const lastAutoTable2 = (doc as any).lastAutoTable;
const endYTable2 = lastAutoTable2.finalY;

// Agregar firma
const titles = "______________________";
const titleXs = 105;
const pageHeight = doc.internal.pageSize.height;

doc.text(titles, titleXs, endYTable2 + 20, { align: "center" });

// Agregar título "Firma"
const titled = "Firma";
const fontSizeTitled = 14;
const titleXd = 105;

doc.setFontSize(fontSizeTitled);
doc.text(titled, titleXd, endYTable2 + 25, { align: "center" });


    // Guardar el PDF
    doc.save('Reporte por Carrera_' + '.pdf');
  }

  DateNow(): string {
    const fechaActual = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
    };
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', options);
    return fechaFormateada;
  }



}
