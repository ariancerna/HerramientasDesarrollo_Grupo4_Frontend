export type EstadoEstudiante = "activo" | "inactivo";

export interface Student {
  id: string;
  dni: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  categoria: string;
  carrera?: string;
  ciclo?: number;
  estado: EstadoEstudiante;
}

export interface StudentFormData {
  dni: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  categoria: string;
  carrera?: string;
  ciclo?: number;
  estado: EstadoEstudiante;
}
