import { PersonaP } from "./PersonaP";

export class Usuario {
    per_id?: number;
    per_activo?: boolean;
    per_cedula?: string;
    per_celular?: string;
    per_correo?: string;
    per_nombres?: string;
    per_apellidos?:string;
    per_calificacion?:string;
    per_tipo?:number;
    per_fenix_id?: PersonaP;
}