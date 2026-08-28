import { RegistroAsistencia } from "@/types/asistencia";

export const MOCK_ASISTENCIAS: RegistroAsistencia[] = [
  {
    id: "asis-001",
    estudianteId: "alu-001",
    dni: "76543210",
    estudiante: "Valentina Rojas Pérez",
    categoria: "Sub-17 femenino",
    fechaHora: "2026-08-21T18:00:00.000Z",
    metodo: "ESCANEO",
  },
  {
    id: "asis-002",
    estudianteId: "alu-001",
    dni: "76543210",
    estudiante: "Valentina Rojas Pérez",
    categoria: "Sub-17 femenino",
    fechaHora: "2026-08-19T18:05:00.000Z",
    metodo: "MANUAL",
  },
  {
    id: "asis-003",
    estudianteId: "alu-002",
    dni: "71234567",
    estudiante: "Diego Mendoza Ruiz",
    categoria: "Sub-19 masculino",
    fechaHora: "2026-08-20T20:00:00.000Z",
    metodo: "ESCANEO",
  },
  {
    id: "asis-004",
    estudianteId: "alu-003",
    dni: "70456789",
    estudiante: "Camila Torres Silva",
    categoria: "Mayores femenino",
    fechaHora: "2026-08-18T19:30:00.000Z",
    metodo: "MANUAL",
  },
];
