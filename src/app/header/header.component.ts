import { Component, OnInit, DoCheck, Input } from "@angular/core";
import { Router } from '@angular/router';
import { NotificacionesService } from "../services/notificaciones.service";
import { AuthService, User } from "@auth0/auth0-angular";
import { LoginService } from "../services/login.service";
import { Persona } from "../models/Persona";
import { getCookie } from "typescript-cookie";
import { catchError, throwError } from "rxjs";
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import { Notificacion } from "../models/Notificacion";

import jspdf from "jspdf";
import { CarreraService } from "../services/carrera.service";
import { Carrera } from "../models/Carrera";
import { RegistroUsuarioService } from "../services/registro-usuario.service";
import { prestamoService } from "../services/prestamo.service";
import { Prestamo } from "../models/Prestamo";
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements DoCheck, OnInit {
    persona: Persona = new Persona();
    personaDeudo: Persona = new Persona();
    reporteN: string = "";
    sinSesion: boolean = false;
    estudiante: boolean = false;
    bibliotecario: boolean = false;
    admin: boolean = false;
    usu: boolean = true;
    carrera: Carrera = new Carrera();
    notificacionmensaje: string = ""
    notificationlista: Notificacion[] = [];
    notificationlistaest: Notificacion[] = [];
    notificaciones: Notificacion[] = [];
    prestamos: Prestamo[] = [];
    prestamosnodevueltos: Prestamo[] = [];
    tipoMensaje: number | undefined;
    personatraida: Persona = new Persona();
    datosLiro: string = "";
    datosLibro2: string | undefined;
    datosLibro3: string | undefined;
    datosPrest: string | undefined;
    datosPrest2: string | undefined;
    datosPrest3: string | undefined;
    datosPrest4: string | undefined;
    constructor(private router: Router, private notificacionesService: NotificacionesService, public auth: AuthService, private logSer: LoginService, private carreraService: CarreraService, private usuarioService: RegistroUsuarioService, private prestamodervice: prestamoService) {

    }



    get nuevosRegistros() { return this.notificacionesService.nuevosRegistros; }
    get nuevosRegistrosEst() { return this.notificacionesService.nuevosRegistrosEst; }

    ngOnInit(): void {

        var personaJSONGET = localStorage.getItem("persona");
        this.persona = JSON.parse(personaJSONGET + "");

        if (this.persona != null) {
            this.notificarEst(this.persona.id!);
            this.obtenerCarrera(this.persona);
            console.log(this.persona)
        } else {
            console.log(this.persona)

        }

        this.notificar();


        this.auth.isAuthenticated$.subscribe(
            (isAuthenticaed) => {
                if (isAuthenticaed) {
                    this.auth.user$.subscribe(user => {
                        if (!this.isTecAzuay(user?.email!)) {
                            Swal.fire({
                                title: '¡Aviso!',
                                text: 'No perteneces al TECNOLOGICO DEL AZUAY!',
                                icon: 'warning',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.auth.logout();
                                }
                            });
                            return;
                        }
                        if (user?.email && user?.name) {
                            this.usuario.correo = user.email;
                            this.usuario.password = user.name + user.email;
                            this.verificar(user.email, user.name)
                        }
                    });
                }
            }
        )
    }


    ngDoCheck(): void {
        this.notificaciones = this.notificacionesService.getNotificationLista();
        // this.notificationlistaest = this.notificacionesService.getNotificationLista();
        this.persona = JSON.parse(localStorage.getItem('persona') + "");
        if (this.persona != null) {
            if (this.persona.tipo == 1 || this.persona.tipo == 2) {
                //estudiante
                this.sinSesion = false;
                this.estudiante = true;
                this.sinSesion
            } else if (this.persona.tipo == 3) {
                //bibliotecario
                this.sinSesion = false;
                this.bibliotecario = true;
                this.admin = false
            } else if (this.persona.tipo == 4) {
                //administrador
                this.sinSesion = false;
                this.admin = true;
                this.bibliotecario = false
            }
        } else {
            this.sinSesion = true
        }
    }
    alerta(men: Notificacion) {
        this.clear();
        console.log(men)
        const objetoString = JSON.stringify(men);
        localStorage.setItem("Dato", objetoString);
        men.visto = true

        this.router.navigate(['/app-lista-solicitudes-pendientes'])
    }
    alertaestudiante(men: Notificacion) {

        this.clear();
        console.log(men)
        const objetoString = JSON.stringify(men);
        localStorage.setItem("Dato", objetoString);
        men.visto = true
        this.editarNotificacion(men);
        this.datosLiro = "" + men.prestamo?.libro?.titulo
        this.datosLibro2 = "" + men.prestamo?.libro?.descripcion
        if (men.prestamo?.libro?.estadoLibro == 1) {
            this.datosLibro3 = "Bueno"

        } else if (men.prestamo?.libro?.estadoLibro == 2) {
            this.datosLibro3 = "Regular"

        } else if (men.prestamo?.libro?.estadoLibro == 3) {
            this.datosLibro3 = "Malo"

        }


        this.datosPrest3 = "" + men.prestamo?.idEntrega?.nombres

        if (men.prestamo?.estadoPrestamo == 1) {
            this.datosPrest = "Solicitado"

        } else if (men.prestamo?.estadoPrestamo == 2) {
            this.datosPrest = "Prestado"

        } else if (men.prestamo?.estadoPrestamo == 3) {
            this.datosPrest = "Recibido"

        } else if (men.prestamo?.estadoPrestamo == 4) {
            this.datosPrest = "Libro destruido"

        } else if (men.prestamo?.estadoPrestamo == 5) {
            this.datosPrest = "No devuelto"

        } else if (men.prestamo?.estadoPrestamo == 6) {
            this.datosPrest = "Restituido"

        } else if (men.prestamo?.estadoPrestamo == 7) {
            this.datosPrest = "Rechazado"

        } else if (men.prestamo?.estadoPrestamo == 7) {
            this.datosPrest = "Aprobado"

        }
        this.datosPrest2 = "" + men.prestamo?.fechaMaxima
        this.datosPrest4 = "" + men.prestamo?.fechaFin
        var overlay = document.getElementById('overlay1');
        overlay?.classList.add('active');
        this.router.navigate([''])
    }
    editarNotificacion(notificacion: Notificacion) {
        this.notificacionesService.updateVisto(notificacion).subscribe(
            response => (
                console.log(response)
            )
        )
    }
    public ocultar() {
        this.notificacionesService.nuevosRegistros = 0;



    }
    public clear() {
        this.notificacionesService.nuevosRegistrosEst = 0;
        this.notificacionesService.nuevosRegistros = 0;


    }
    cerrarpopup() {
        var overlay1 = document.getElementById('overlay1');
        overlay1?.classList.remove('active');
    }
    cerrarpopup2() {
        var overlay2 = document.getElementById('overlay2');
        overlay2?.classList.remove('active');
    }
    user?: User = new User;
    usuario = new Persona();


    verificar(email: string, nombres: string) {
        this.logSer.verificar(email, nombres).subscribe({
            next: response => {

            },
            error: error => {
                if (error.status === 400) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '<strong> Credenciales Incorrectas</strong><br>  Verifica tu cuenta',
                        showConfirmButton: false,
                        timer: 3000
                    })
                }

                if (error.status === 200) {
                    this.validateUser(this.usuario)
                }
            }
        });
    }

    public notificar() {
        this.notificacionesService.getNotificacionBibliotecario().subscribe(
            response => (this.notificationlista = response, this.validarconteoB())
        )

    }
    public notificarEst(id: number) {
        this.notificacionesService.getNotificacionPersona(id).subscribe(
            response => (this.notificationlistaest = response, this.validarconteo())
        )


    }
    validarconteo() {
        if (this.notificationlistaest != null) {
            this.notificationlistaest.forEach(element => {
                if (element.visto == false && element.mensaje === 3 || element.mensaje === 5 || element.mensaje === 6 || element.mensaje === 7) {
                    this.notificacionesService.actualizarConteoEst(1)
                }
            });
        } else {

        }

    }
    validarconteoB() {
        if (this.notificationlista != null) {
        console.log(this.notificationlista.length)
        for (let index = 0; index < this.notificationlista.length; index++) {
            if (this.notificationlista[index].visto === false) {

                console.log(this.notificationlista[index].mensaje)
                this.notificacionesService.actualizarConteo(1)
            }

        }
    }

        
    }

    validateUser(model: Persona) {
        this.logSer.validateLoginDetails(this.usuario).pipe(
            catchError(error => {
                if (error.status === 401) {
                    console.log('BAD CREDENTIALS')
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '<strong> Credenciales Incorrectas</strong><br>  Verifica tu cuenta',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    //this.toastr.error('Credenciales incorrectas', 'Error de autenticación');
                }
                return throwError(error);
            })
        ).subscribe(
            responseData => {
                const authorizationHeader = responseData.headers.get('Authorization');
                if (authorizationHeader) {
                    window.sessionStorage.setItem('Authorization', authorizationHeader);
                    const decodedToken: any = jwt_decode(authorizationHeader); // Decode the JWT
                    const role = decodedToken.authorities; // Assuming the role is stored in the 'role' field of the JWT payload
                    localStorage.setItem("roles", role)

                    this.usuario = <any>responseData.body;
                    this.usuario.authStatus = 'AUTH';
                    window.sessionStorage.setItem('userdetails', JSON.stringify(this.usuario));
                    const xsrf = getCookie('XSRF-TOKEN')!;
                    if (xsrf !== undefined) {
                        window.sessionStorage.setItem("XSRF-TOKEN", xsrf);
                    } //Arreglar que cuando ingrese con un segundo intento se cree el xsrf

                    if (sessionStorage.getItem('userdetails')) {

                        this.usuario = JSON.parse(sessionStorage.getItem('userdetails')!);
                        const role = localStorage.getItem('roles');
                        let usuarioJSON = JSON.stringify(this.usuario);
                        localStorage.setItem('persona', usuarioJSON);
                        if (this.usuario.celular == undefined || this.usuario.celular == null && this.usuario.direccion == undefined || this.usuario.direccion == null) {
                            Swal.fire({
                                confirmButtonColor: '#012844',
                                icon: 'warning',
                                title: 'Llene todos los campos',
                            })
                            this.router.navigate(['/app-form-editUsuario']);
                        } else {
                            switch (role) {
                                case 'ROLE_STUD':
                                    this.router.navigate(['/']);

                                    break;
                                case 'ROLE_ADMIN':
                                    this.router.navigate(['/']);
                                    break;
                                case 'ROLE_ADMIN':
                                    this.router.navigate(['/']);
                                    break;
                                default:
                                    this.router.navigate(['../']);
                                    console.log('Selected role is unknown.');
                                    break;
                            }
                            console.log(role);
                        }
                    }
                }
            }
        );
    }

    obtenerCarrera(persona: Persona) {
        this.carreraService.carreraest(persona.cedula!).subscribe(
            response => (
                console.log(response),
                this.carrera = response,
                console.log(this.carrera)
            )
        )
    }

    async obtenerPersona() {
        const { value: cedula } = await Swal.fire({
            title: 'Verificación de no adeudo',
            input: 'number',
            inputLabel: 'Ingrese el numero de cedula del estudiante',
            inputPlaceholder: 'La cedula es:',
            inputValidator: (value) => {
                return new Promise((resolve: any) => {
                    if (value.length === 10) {
                        resolve()
                    } else {
                        resolve('Ingrese una cedula!')
                    }
                })
            }
        })

        if (cedula) {
            this.usuarioService.obtenerCedula(cedula).subscribe(
                response => (
                    console.log(response),
                    this.verificarEstudiante(response)

                ), error => (
                    Swal.fire({ title: 'No se encontro a la persona', icon: "error" })
                )
            )
        }

    }

    //verificarEstudiante
    verificarEstudiante(per: Persona) {
        if (per.tipo === 1) {
            this.personaDeudo = per,
                this.obtenerCarrera(this.personaDeudo),
                this.verificaradeudo(per)
        } else {
            Swal.fire({
                title: 'La persona encontrada '+per.nombres +' no es estudiante!',
                icon:"warning",
                text: 'Por favor solo los estudiantes pueden obtener el certificado de no adeudo.',
                html:'¡Verfique nuevamente!',
                timer: 6000
            })
            this.limpiar()
        }
    }
    //limpiar
    limpiar() {
        this.prestamos = [],
            this.personaDeudo = {}
    }
    //Confirmar
    confirmarSeleccion(persona: Persona) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'El usuario ' + persona.nombres + ' no tiene prestamos pendientes',
            text: "¿Desea generar el certificado?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si, generar!',
            confirmButtonColor: '#012844',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {

                swalWithBootstrapButtons.fire(
                    'Generado!',
                    'Su certificado esta siendo generado!.',
                    'success'
                ), this.generatePDF(persona);
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado'
                ), this.limpiar();
            }
        })
    }

    //Confirmar No generar
    confirmarSeleccionDeuda(persona: Persona, prestamos: Prestamo[]) {
        console.log(prestamos)
        this.prestamosnodevueltos = prestamos
        var overlay2 = document.getElementById('overlay2');
        overlay2?.classList.add('active');
        this.limpiar();
    }


    //Verificar
    verificaradeudo(persona: Persona) {
        this.prestamodervice.verificardeudas(persona.cedula + "").subscribe(
            (response: Prestamo[]) => (
                this.prestamos = response,
                console.log(response),
                this.ver(persona, response)

            )
        )


    }

    ver(persona: Persona, prestamos: Prestamo[]) {
        if (prestamos === null) {
            
            this.confirmarSeleccion(persona)
        } else if (prestamos != null) {
            
            this.confirmarSeleccionDeuda(persona, prestamos)

        }
    }


    //REPORTE CERTIFICADO DE NO ADEUDO
    generatePDF(persona: Persona) {


        const fechaactual = new Date(Date.now());
        // Obtén el nombre del día de la semana
        const nombreDia = obtenerNombreDiaSemana(fechaactual.getDay());

        // Obtén el número del día del mes
        const numeroDia = fechaactual.getDate();

        // Obtén el nombre del mes
        const nombreMes = obtenerNombreMes(fechaactual.getMonth());



        const anio = fechaactual.getFullYear();

        // Formatea la fecha en el formato deseado
        const fechaFormateada = `${numeroDia} de ${nombreMes} de ${anio}`;




        // Función para obtener el nombre del día de la semana
        function obtenerNombreDiaSemana(diaSemana: any) {
            const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
            return diasSemana[diaSemana];
        }

        // Función para obtener el nombre del mes
        function obtenerNombreMes(mes: any) {
            const nombresMeses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            return nombresMeses[mes];
        }

        const imageUrl = 'data:image/jpeg;base64,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';
        const encodedUrl = encodeURIComponent(imageUrl);
        // Crea un nuevo documento jspdf
        const doc = new jspdf();

        // Carga la imagen desde la URL
        doc.addImage(encodedUrl, 'PNG', 80, 10, 50, 50);








        // Agregar tabla de 3 filas por 3 columnas
        const form3 = [

            [{ content: 'CERTIFICADO DE NO ADEUDO', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 20, textColor: '#FFFFFF', fontStyle: 'bold' } }],

            [{ content: 'Cuenca, ' + fechaFormateada, colSpan: 6, styles: { halign: 'right', fillColor: '#FFFFFF', fontSize: 15, textColor: '#FFFFFF', fontStyle: 'normal' } }],


            //persona
            [{ content: 'Yo JULIANA PICHAZACA, en mi carácter de Jefe de la Unidad de Servicio de Biblioteca del Instituto Superior Tecnológico del Azuay, hago constar que el estudiante de la carrera ' + this.carrera.nombre + ' :', colSpan: 6, styles: { halign: 'center', fontSize: 15, fillColor: '#FFFFFF', textColor: '#000000', fontStyle: 'normal' } }],

            [{ content: persona.nombres + ' ' + persona.apellidos + ' CI: ' + persona.cedula, colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 15, textColor: '#000000', fontStyle: 'bold' } }],

            [{ content: 'No tiene adeudo de los libros en la biblioteca a mi cargo.\nSe extiende la presente para los fines que al interesado le convenga.', colSpan: 6, styles: { halign: 'center', fontSize: 15, fillColor: '#FFFFFF', textColor: '#000000', fontStyle: 'normal' } }],

            [{ content: 'Atentamente:', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 15, textColor: '#000000', fontStyle: 'normal' } }],
            [{ content: 'Mgtr. Juliana Rocío Pichazaca Tenesaca Jefe de la Unidad de Servicio de Biblioteca', colSpan: 6, styles: { halign: 'center', fontSize: 15, fillColor: '#FFFFFF', textColor: '#000000', fontStyle: 'bold' } }],

            //espacios
            [{ content: '', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 20, textColor: '#FFFFFF', fontStyle: 'bold' } }],
            [{ content: '', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 20, textColor: '#FFFFFF', fontStyle: 'bold' } }],
            [{ content: '', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 20, textColor: '#FFFFFF', fontStyle: 'bold' } }],

            [{ content: '____________________', colSpan: 6, styles: { halign: 'center', fontSize: 15, fillColor: '#FFFFFF', textColor: '#000000', fontStyle: 'bold' } }],
            [{ content: 'Firma del estudiante', colSpan: 6, styles: { halign: 'center', fontSize: 15, fillColor: '#FFFFFF', textColor: '#000000', fontStyle: 'bold' } }],

            //espacios

            [{ content: '', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 20, textColor: '#FFFFFF', fontStyle: 'bold' } }],
            [{ content: '', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 20, textColor: '#FFFFFF', fontStyle: 'bold' } }],


            [{ content: 'Dirección: Av. Octavio Chacón 1-98 y Primera Transversal\n Teléfono: (07) 2809-551 / Celular: 0995363076\nE-mail: secretaria@tecazuay.edu.ec', colSpan: 6, styles: { halign: 'center', fontSize: 15, fillColor: '#FFFFFF', textColor: '#000000', fontStyle: 'normal' } }],
            [{ content: 'Cuenca – Ecuador', colSpan: 6, styles: { halign: 'center', fillColor: '#FFFFFF', fontSize: 15, textColor: '#000000', fontStyle: 'bold' } }],
            //datos

            // Agrega más filas según sea necesario
        ];
        (doc as any).autoTable({
            body: form3,
            tableWidth: 'auto',
            startY: 70,
            didParseCell: function (data: any) {
                if (data.row.index === 0 || data.row.index === 1 || data.row.index === 3) {
                    // Establecer color de fondo
                    data.cell.styles.fillColor = '#FFFFFF';

                    // Establecer color de letra
                    data.cell.styles.textColor = '#000000';
                }

                // Añadir bordes



                // Establecer estilo de borde para las celdas superiores
                if (data.row.index === 0) {
                    data.cell.styles.borderTopStyle = 'solid';
                }

            }

        });







        // Guardar el documento PDF
        doc.save('Certificado de no adeudo_' + persona.nombres + '.pdf');
        this.limpiar();
    }


    isTecAzuay(email: string): boolean {
        const pattern = /@tecazuay\.edu\.ec$/i; // Expresión regular para buscar la terminación "@tecazuay.edu.ec" (el sufijo "$" asegura que la coincidencia esté al final del texto)
        return pattern.test(email);
    }

}



