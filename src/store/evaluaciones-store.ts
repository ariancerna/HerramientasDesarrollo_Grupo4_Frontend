import { Evaluacion, EvaluacionFormData } from "@/types/evaluacion";
import { api, apiTodasLasPaginas } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";
import { getSession } from "@/store/auth-store";

type Nota = number | null;
/** Evaluación tal como la devuelve el backend (las notas opcionales llegan como null). */
interface EvaluacionApi extends Omit<Evaluacion, "rendimientoTecnico" | "rendimientoFisico" | "actitud"> {
  rendimientoTecnico: Nota;
  rendimientoFisico: Nota;
  actitud: Nota;
}

function aEvaluacion(evaluacion: EvaluacionApi): Evaluacion {
  return {
    id: evaluacion.id,
    alumnoId: evaluacion.alumnoId,
    profesorId: evaluacion.profesorId,
    fecha: evaluacion.fecha,
    rendimientoTecnico: evaluacion.rendimientoTecnico ?? undefined,
    rendimientoFisico: evaluacion.rendimientoFisico ?? undefined,
    actitud: evaluacion.actitud ?? undefined,
    observaciones: evaluacion.observaciones,
  };
}

// Solo profesores y administradores consultan evaluaciones; el backend ya
// limita al profesor a las suyas.
const evaluaciones = crearColeccionRemota<Evaluacion>("evaluaciones", async () => {
  if (getSession()?.usuario.rol === "alumno") return [];
  return (await apiTodasLasPaginas<EvaluacionApi>("/evaluaciones")).map(aEvaluacion);
});

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
  const nueva = aEvaluacion(await api<EvaluacionApi>("/evaluaciones", { method: "POST", body: data }));
  evaluaciones.establecer([nueva, ...obtenerEvaluaciones()]);
  return nueva;
}

export async function actualizarEvaluacion(
  id: string,
  data: EvaluacionFormData,
): Promise<Evaluacion> {
  const actualizada = aEvaluacion(
    await api<EvaluacionApi>(`/evaluaciones/${id}`, { method: "PUT", body: data }),
  );
  evaluaciones.establecer(
    obtenerEvaluaciones().map((evaluacion) => (evaluacion.id === id ? actualizada : evaluacion)),
  );
  return actualizada;
}

export async function eliminarEvaluacion(id: string): Promise<void> {
  await api(`/evaluaciones/${id}`, { method: "DELETE" });
  evaluaciones.establecer(obtenerEvaluaciones().filter((evaluacion) => evaluacion.id !== id));
}
