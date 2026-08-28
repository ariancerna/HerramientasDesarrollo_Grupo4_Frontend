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
