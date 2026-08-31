export type Role = "administrador" | "profesor" | "alumno";

export interface Usuario {
  id: string;
  usuario: string;
  nombre: string;
  rol: Role;
  estudianteId?: string;
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
}

export interface Categoria {
  id: string;
  nombre: string;        // "Sub-10", "Sub-12", etc.
  descripcion?: string;
  horarios: Horario[];
}