import { Evaluacion, EvaluacionFormData } from "@/types/evaluacion";
import { api } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";

// El backend responde con el formato de Evaluacion y ya filtra por rol
// (el profesor recibe las suyas; el alumno, las que le registraron).
const evaluaciones = crearColeccionRemota<Evaluacion>("evaluaciones", () =>
  api<Evaluacion[]>("/evaluaciones"),
);

export const useEvaluaciones = () => useColeccion(evaluaciones);

export function obtenerEvaluaciones(): Evaluacion[] {
  return evaluaciones.obtener();
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

/** El profesor se toma del token en el backend. */
export async function crearEvaluacion(data: EvaluacionFormData): Promise<Evaluacion> {
  const nueva = await api<Evaluacion>("/evaluaciones", { method: "POST", body: data });
  evaluaciones.establecer([nueva, ...obtenerEvaluaciones()]);
  return nueva;
}

export async function actualizarEvaluacion(
  id: string,
  data: EvaluacionFormData,
): Promise<Evaluacion> {
  const actualizada = await api<Evaluacion>(`/evaluaciones/${id}`, { method: "PUT", body: data });
  evaluaciones.establecer(
    obtenerEvaluaciones().map((evaluacion) => (evaluacion.id === id ? actualizada : evaluacion)),
  );
  return actualizada;
}

export async function eliminarEvaluacion(id: string): Promise<void> {
  await api(`/evaluaciones/${id}`, { method: "DELETE" });
  evaluaciones.establecer(obtenerEvaluaciones().filter((evaluacion) => evaluacion.id !== id));
}
