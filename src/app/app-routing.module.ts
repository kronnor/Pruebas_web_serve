import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevolverLibroComponent } from './devolver-libro/devolver-libro.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { ReporteSugerenciasComponent } from './reporte-sugerencias/reporte-sugerencias.component';
import { ReporteLibrosComponent } from './reporte-libros/reporte-libros.component';
import { FormComponentb } from './registro-bibliotecario/form.component';
import { FormEditBComponent } from './registro-bibliotecario/form-edit-b.component';
import { HomeComponent } from './home/home/home.component';
import { RegistroBibliotecarioComponent } from './registro-bibliotecario/registro-bibliotecario.component';
import { ListaBibliotecariosComponent } from './lista-bibliotecarios/lista-bibliotecarios.component';
import { ListasComponent } from './listas/listas.component';
import { ListaSolicitudesPendientesComponent } from './lista-solicitudes-pendientes/lista-solicitudes-pendientes.component';
import { SolicitudLibroComponent } from './solicitud-libro/solicitud-libro.component';
import { SolicitudLibroDomicilioComponent } from './solicitud-libro-domicilio/solicitud-libro-domicilio.component';
import { VistaRegistroNewComponent } from './vista-registro-new/vista-registro-new.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { RegistroSolicitudComponent } from './registro-solicitud/registro-solicitud.component';
import { RegistroAutorComponent } from './registro-autor/registro-autor.component';
import { RegistroTipoComponent } from './registro-tipo/registro-tipo.component';
import { RegistroSolicitudTercerapersonaComponent } from './registro-solicitud-tercerapersona/registro-solicitud-tercerapersona.component';
import { ListaDocentesComponent } from './lista-docentes/lista-docentes.component';
import { ListaTecerosComponent } from './lista-teceros/lista-teceros.component';
import { RegEtiquetasComponent } from './vista-registro-new/reg-etiquetas/reg-etiquetas.component';
import { ListaSolicitudesTercerosComponent } from './lista-solicitudes-terceros/lista-solicitudes-terceros.component';
import { LoaderComponent } from './loader/loader.component';
import { LibroCompletoComponent } from './libro-completo/libro-completo.component';
import { DevolverLibroTerceroComponent } from './devolver-libro-tercero/devolver-libro-tercero.component';
import { ListaDonanteComponent } from './lista-donante/lista-donante/lista-donante.component';
import { RegistroDonanteComponent } from './registro-donante/registro-donante.component';

const routes: Routes = [
      {path: 'app-devolver-libro', component: DevolverLibroComponent, canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_STUD'] } },
      {path: 'app-registro-usuario', component: RegistroUsuarioComponent},
      {path: 'app-reporte-sugerencias', component: ReporteSugerenciasComponent},
      {path: 'app-reporte-libros', component: ReporteLibrosComponent},
      {path: 'app-devolver-libro-tercero', component: DevolverLibroTerceroComponent},
      {path: 'app-form-bibliotecario', component: FormComponentb},
      {path: 'app-libro-completo', component: LibroCompletoComponent},
      {path: 'app-form-editBibliotecario', component: FormEditBComponent},
      {path: 'app-registro-solicitud', component: RegistroSolicitudComponent},
      {path: '', component: HomeComponent},
      {path: 'app-registro-bibliotecario', component: RegistroBibliotecarioComponent},
      {path: 'app-lista-solicitudes-terceros', component: ListaSolicitudesTercerosComponent},
      {path: 'app-lista-bibliotecarios', component: ListaBibliotecariosComponent},
      {path: 'app-listas', component: ListasComponent},
      {path: 'app-lista-solicitudes-pendientes', component: ListaSolicitudesPendientesComponent},
      {path: 'app-solicitud-libro', component: SolicitudLibroComponent},
      {path: 'app-solicitud-libro-domicilio', component: SolicitudLibroDomicilioComponent},
      {path: 'app-vista-registro-new', component: VistaRegistroNewComponent},
      {path: 'app-registro-solicitud-tercerapersona', component: RegistroSolicitudTercerapersonaComponent},
      {path: 'app-registro-autor', component: RegistroAutorComponent},
      {path: 'app-registro-tipo', component: RegistroTipoComponent},
      {path: 'app-lista-docentes', component: ListaDocentesComponent},
      {path: 'app-lista-terceros', component: ListaTecerosComponent},
      {path: 'app-registro-etiquetas', component: RegEtiquetasComponent},
      {path: 'app-lista-donante', component: ListaDonanteComponent},
      {path: 'app-registro-donante', component: RegistroDonanteComponent},
      {path: 'app-loader', component: LoaderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
