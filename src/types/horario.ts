import { Horario } from "@/types";

export type EstadoHorario = "activo" | "cancelado";

export interface HorarioEntrenamiento extends Omit<Horario, "cancha" | "estado"> {
  categoriaId: string;
  categoria: string;
  profesorId: string;
  cancha?: string;
  estado: EstadoHorario;
}

export type HorarioAsignado = HorarioEntrenamiento;

export const DIAS_SEMANA: Horario["dia"][] = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

export const NOMBRES_DIAS: Record<Horario["dia"], string> = {
  lunes: "Lunes",
  martes: "Martes",
  miércoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sábado: "Sábado",
  domingo: "Domingo",
};