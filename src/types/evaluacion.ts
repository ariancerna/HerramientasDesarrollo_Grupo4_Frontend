export interface Evaluacion {
  id: string;
  alumnoId: string;
  profesorId: string;
  fecha: string;
  rendimientoTecnico?: number;
  rendimientoFisico?: number;
  actitud?: number;
  observaciones: string;
}

export type EvaluacionFormData = Omit<Evaluacion, "id" | "profesorId">;