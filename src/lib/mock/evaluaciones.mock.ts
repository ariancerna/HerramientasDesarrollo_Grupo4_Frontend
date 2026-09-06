import { Evaluacion } from "@/types/evaluacion";

export const MOCK_EVALUACIONES: Evaluacion[] = [
  {
    id: "eval-001",
    alumnoId: "alu-001",
    profesorId: "u-002",
    fecha: "2026-09-01",
    rendimientoTecnico: 8,
    rendimientoFisico: 7,
    actitud: 9,
    observaciones: "Buen control del balón y actitud positiva durante el entrenamiento.",
  },
  {
    id: "eval-002",
    alumnoId: "alu-002",
    profesorId: "u-002",
    fecha: "2026-08-28",
    rendimientoTecnico: 7,
    rendimientoFisico: 8,
    actitud: 8,
    observaciones: "Debe mejorar la precisión de los pases largos.",
  },
];