export type EstadoEstudiante = "activo" | "inactivo";

export interface Student {
  id: string;
  profesorId?: string;
  dni: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fotoUrl?: string;
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

export interface StudentProfileData {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fotoUrl?: string;
}
