import type { EventoClub } from "@/types/calendario";

export const MOCK_EVENTOS_CLUB: EventoClub[] = [
  {
    id: "evento-amistoso-sub17-2026-09",
    titulo: "Encuentro amistoso",
    fecha: "2026-09-12",
    horaInicio: "15:30",
    horaFin: "17:30",
    ubicacion: "Complejo deportivo El Golazo",
    categoria: "Sub-17 femenino",
    descripcion: "Partido de preparación frente a Academia Lima Norte.",
  },
  {
    id: "evento-integracion-2026-09",
    titulo: "Jornada de integración",
    fecha: "2026-09-26",
    horaInicio: "10:00",
    horaFin: "13:00",
    ubicacion: "Cancha principal",
    descripcion: "Actividades deportivas para alumnos y familias del club.",
  },
  {
    id: "evento-torneo-sub17-2026-10",
    titulo: "Copa Metropolitana — fecha 1",
    fecha: "2026-10-03",
    horaInicio: "09:00",
    horaFin: "11:00",
    ubicacion: "Estadio Municipal de Los Olivos",
    categoria: "Sub-17 femenino",
    descripcion: "Primera fecha de la fase clasificatoria.",
  },
];
