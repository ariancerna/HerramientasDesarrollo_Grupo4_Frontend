import { HorarioEntrenamiento } from "@/types/horario";

export const MOCK_HORARIOS: HorarioEntrenamiento[] = [
  {
    id: "horario-demo-1",
    profesorId: "u-002",
    categoriaId: "cat-sub10",
    categoria: "Sub-10",
    dia: "lunes",
    horaInicio: "09:00",
    horaFin: "11:00",
    cancha: "Cancha principal",
    estado: "activo",
  },
  {
    id: "horario-demo-2",
    profesorId: "u-002",
    categoriaId: "cat-sub12",
    categoria: "Sub-12",
    dia: "jueves",
    horaInicio: "15:00",
    horaFin: "17:00",
    cancha: "Cancha 2",
    estado: "cancelado",
  },
];