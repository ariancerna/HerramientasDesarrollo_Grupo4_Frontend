export type TipoActividad = "entrenamiento" | "evento";

export interface ActividadCalendario {
  id: string;
  tipo: TipoActividad;
  titulo: string;
  fecha: string;
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  categoria?: string;
  descripcion?: string;
}

export interface EventoClub {
  id: string;
  titulo: string;
  fecha: string;
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  categoria?: string;
  descripcion: string;
}
