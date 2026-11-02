export type Role = "administrador" | "profesor" | "alumno";

export interface Usuario {
  id: string;
  usuario: string;
  nombre: string;
  rol: Role;
  estudianteId?: string;
  /** Foto de perfil de la cuenta (para alumnos se usa la de su ficha). */
  fotoUrl?: string;
}

export interface Session {
  usuario: Usuario;
  loginTime: number;
  lastActivity: number;
}

export interface Horario {
  id: string;
  dia: "lunes" | "martes" | "miércoles" | "jueves" | "viernes" | "sábado" | "domingo";
  horaInicio: string; // "09:00"
  horaFin: string;    // "11:00"
  cancha?: string;
  estado?: "activo" | "cancelado";
}

export interface Categoria {
  id: string;
  nombre: string;        // "Sub-10", "Sub-12", etc.
  descripcion?: string;
  profesorIds?: string[];
  horarios: Horario[];
}

export interface Sede {
  id: string;
  nombre: string;        // "Puente Piedra", "Los Olivos", etc.
  direccion?: string;
}

export interface Profesor {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  sedeId?: string;
}

/** Datos del formulario de profesor; la contraseña nunca se guarda en el estado. */
export interface DatosProfesor extends Omit<Profesor, "id"> {
  password?: string;
}