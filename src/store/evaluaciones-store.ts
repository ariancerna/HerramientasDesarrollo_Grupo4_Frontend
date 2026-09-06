import { MOCK_EVALUACIONES } from "@/lib/mock/evaluaciones.mock";
import { Evaluacion, EvaluacionFormData } from "@/types/evaluacion";

const STORAGE_KEY = "kickstamp-evaluaciones";

function esNavegador() {
  return typeof window !== "undefined";
}

function crearId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function guardarEvaluaciones(evaluaciones: Evaluacion[]) {
  if (esNavegador()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluaciones));
  }
}

export function obtenerEvaluaciones(): Evaluacion[] {
  if (!esNavegador()) return MOCK_EVALUACIONES;

  const almacenadas = localStorage.getItem(STORAGE_KEY);
  if (!almacenadas) {
    guardarEvaluaciones(MOCK_EVALUACIONES);
    return MOCK_EVALUACIONES;
  }

  try {
    const evaluaciones: unknown = JSON.parse(almacenadas);
    return Array.isArray(evaluaciones)
      ? (evaluaciones as Evaluacion[])
      : MOCK_EVALUACIONES;
  } catch {
    return MOCK_EVALUACIONES;
  }
}

export function obtenerEvaluacionesPorAlumno(alumnoId: string): Evaluacion[] {
  return obtenerEvaluaciones()
    .filter((evaluacion) => evaluacion.alumnoId === alumnoId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function obtenerEvaluacionesPorProfesor(profesorId: string): Evaluacion[] {
  return obtenerEvaluaciones()
    .filter((evaluacion) => evaluacion.profesorId === profesorId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function crearEvaluacion(
  data: EvaluacionFormData,
  profesorId: string,
): Evaluacion {
  const nueva: Evaluacion = { ...data, id: crearId(), profesorId };
  guardarEvaluaciones([nueva, ...obtenerEvaluaciones()]);
  return nueva;
}

export function actualizarEvaluacion(
  id: string,
  data: EvaluacionFormData,
): Evaluacion | null {
  const evaluaciones = obtenerEvaluaciones();
  const indice = evaluaciones.findIndex((evaluacion) => evaluacion.id === id);
  if (indice === -1) return null;

  const actualizada: Evaluacion = {
    ...evaluaciones[indice],
    ...data,
  };
  const nuevasEvaluaciones = [...evaluaciones];
  nuevasEvaluaciones[indice] = actualizada;
  guardarEvaluaciones(nuevasEvaluaciones);
  return actualizada;
}

export function eliminarEvaluacion(id: string): void {
  guardarEvaluaciones(
    obtenerEvaluaciones().filter((evaluacion) => evaluacion.id !== id),
  );
}