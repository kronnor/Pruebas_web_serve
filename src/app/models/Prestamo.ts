import { Libro } from "./Libro";
import { Carrera } from "./Carrera";
import { Persona } from "./Persona";

export class Prestamo {
    id?: number;
    activo?: boolean;
    documentoHabilitante?: number;
    escaneoMatriz?:string;
    estadoLibro?: number;
    estadoPrestamo?: number;
    fechaEntrega?: Date;
    fechaFin?: Date;
    fechaMaxima?: Date;
    fechaDevolucion?: Date;
    tipoPrestamo?:number;
    carrera?: Carrera;
    idEntrega?:Persona;
    idSolicitante?:Persona;
    idRecibido?:Persona;
    libro?: Libro;
}
