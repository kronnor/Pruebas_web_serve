import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import { RouterModule } from '@angular/router';
import{HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { RegistroUsuarioService } from './services/registro-usuario.service';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroBibliotecarioComponent } from './registro-bibliotecario/registro-bibliotecario.component'
import { ListaBibliotecariosComponent } from './lista-bibliotecarios/lista-bibliotecarios.component';
import { ListasComponent } from './listas/listas.component';
import { ListaSolicitudesPendientesComponent } from './lista-solicitudes-pendientes/lista-solicitudes-pendientes.component';
import { PersonaService } from './services/persona.service';
import { FormComponentb } from './registro-bibliotecario/form.component';
import { LibroService } from './services/libro.service';
import { SolicitudLibroComponent } from './solicitud-libro/solicitud-libro.component';
import { FormEditBComponent } from './registro-bibliotecario/form-edit-b.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DevolverLibroComponent } from './devolver-libro/devolver-libro.component';
import { VistaRegistroNewComponent } from './vista-registro-new/vista-registro-new.component';
import { HomeComponent } from './home/home/home.component';
import { ReporteLibrosComponent } from './reporte-libros/reporte-libros.component';
import { ReporteSugerenciasComponent } from './reporte-sugerencias/reporte-sugerencias.component';
import { SolicitudLibroDomicilioComponent } from './solicitud-libro-domicilio/solicitud-libro-domicilio.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from '@auth0/auth0-angular';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { LibraryInterceptor } from './interceptors/library.interceptor';
import { AuthGuard } from './guards/auth.guard';

import { RegistroTipoComponent } from './registro-tipo/registro-tipo.component';
import { RegistroAutorComponent } from './registro-autor/registro-autor.component';
import { RegistroSolicitudComponent } from './registro-solicitud/registro-solicitud.component';
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
import { RegistroEtiquetaComponent } from './registro-etiqueta/registro-etiqueta.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    RegistroUsuarioComponent,
    FormComponentb,
    RegistroBibliotecarioComponent,
    ListaBibliotecariosComponent,
    ListasComponent,
    ListaSolicitudesPendientesComponent,
    SolicitudLibroComponent,
    FormEditBComponent,
    DevolverLibroComponent,
    VistaRegistroNewComponent,
    HomeComponent,
    ReporteLibrosComponent,
    ReporteSugerenciasComponent,
    SolicitudLibroDomicilioComponent,
    LoginComponent,
    LogoutComponent,
    RegistroTipoComponent,
    RegistroAutorComponent,
    RegistroSolicitudComponent,
    RegistroSolicitudTercerapersonaComponent,
    ListaDocentesComponent,
    ListaTecerosComponent,
    RegEtiquetasComponent,
    ListaSolicitudesTercerosComponent,
    LoaderComponent,
    LibroCompletoComponent,
    DevolverLibroTerceroComponent,
    ListaDonanteComponent,
    RegistroDonanteComponent,
    RegistroEtiquetaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'dev-7dy745w33mkcupyd.us.auth0.com',
      clientId: 'xIoWfIWlh1g4usMBPOfitARq9Pm5nfHF',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  providers: [
    RegistroUsuarioService,
    LibroService,
    PersonaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LibraryInterceptor,
      multi: true
    },
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
