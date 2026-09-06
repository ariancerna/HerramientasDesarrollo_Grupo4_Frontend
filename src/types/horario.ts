import { Horario } from "@/types";

export interface HorarioAsignado extends Horario {
  categoriaId: string;
  categoria: string;
  profesorId: string;
}

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