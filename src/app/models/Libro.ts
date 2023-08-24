
import { Donante } from "./Donante";
import { Persona } from "./Persona";
import { Tipo } from "./Tipo";

export class Libro{
    id?: number;
    codigoDewey?: string;
    titulo?: string;
    subtitulo?:string;
    tipo?:Tipo;
    adquisicion?: string;
    anioPublicacion?: number;
    editor?: string;
    ciudad?: string;
    numPaginas?: number;
    area?: string;
    conIsbn?: string;
    idioma?: string;
    descripcion?: string;
    indiceUno?: string;
    indiceDos?: string;
    indiceTres?: string;
    dimenciones?: string;
    estadoLibro?: number;
    activo?:boolean;
    urlImagen?: string;
    urlDigital?: string;
    persona?: Persona;
    fechaCreacion?: Date;
    disponibilidad?: boolean;
    donante?: Donante;
    urlActaDonacion?: ArrayBuffer;

}
