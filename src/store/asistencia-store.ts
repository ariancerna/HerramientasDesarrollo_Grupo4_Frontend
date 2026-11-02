import {
  DatosCorreccionAsistencia,
  EstudianteAsistencia,
  FiltrosAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
} from "@/types/asistencia";
import { api, ApiError } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";
import { obtenerCategorias } from "@/store/categorias-store";

export type {
  DatosCorreccionAsistencia,
  EstudianteAsistencia,
  FiltrosAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
} from "@/types/asistencia";

// El backend ya responde con el formato de RegistroAsistencia, del más reciente al más antiguo.
// Para un alumno solo devuelve sus propios registros.
const asistencias = crearColeccionRemota<RegistroAsistencia>("asistencias", () =>
  api<RegistroAsistencia[]>("/asistencias"),
);

export const suscribirAsistencias = asistencias.suscribir;
export const useRegistrosAsistencia = () => useColeccion(asistencias);

function fechaLocal(fechaHora: string) {
  const fecha = new Date(fechaHora);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface AlumnoPorDniApi {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  categoria_id: string | null;
  estado: "activo" | "inactivo";
}

/** Busca un alumno por DNI para registrar su asistencia; undefined si no existe. */
export async function buscarEstudiantePorDni(dni: string): Promise<EstudianteAsistencia | undefined> {
  try {
    const alumno = await api<AlumnoPorDniApi>(`/alumnos/dni/${dni}`);
    const categoria = obtenerCategorias().find((item) => item.id === alumno.categoria_id);
    return {
      id: alumno.id,
      dni: alumno.dni,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      categoria: categoria?.nombre ?? "",
      activo: alumno.estado === "activo",
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

export async function registrarAsistencia(
  estudiante: EstudianteAsistencia,
  metodo: MetodoAsistencia,
  fechaHora = new Date().toISOString(),
): Promise<RegistroAsistencia> {
  if (Number.isNaN(new Date(fechaHora).getTime())) {
    throw new Error("La fecha u hora de asistencia no es válida.");
  }

  // El backend rechaza un segundo registro del mismo alumno en el mismo día.
  const registro = await api<RegistroAsistencia>("/asistencias", {
    method: "POST",
    body: { alumnoId: estudiante.id, metodo, fechaHora },
  });
  asistencias.establecer([registro, ...asistencias.obtener()]);
  return registro;
}

export function obtenerRegistrosAsistencia(): RegistroAsistencia[] {
  return asistencias.obtener();
}

export function obtenerAsistenciasPorEstudiante(
  estudianteId: string,
): RegistroAsistencia[] {
  return asistencias.obtener().filter(
    (registro) => registro.estudianteId === estudianteId,
  );
}

export function filtrarAsistencias(
  registros: RegistroAsistencia[],
  opciones: FiltrosAsistencia,
): RegistroAsistencia[] {
  const texto = opciones.texto?.trim().toLowerCase() ?? "";
  const categoria = opciones.categoria ?? "todas";
  const fecha = opciones.fecha ?? "";

  return registros.filter((registro) => {
    const coincideTexto =
      texto === "" ||
      registro.estudiante.toLowerCase().includes(texto) ||
      registro.dni.includes(texto);
    const coincideCategoria =
      categoria === "todas" || registro.categoria === categoria;
    const coincideFecha = fecha === "" || fechaLocal(registro.fechaHora) === fecha;

    return coincideTexto && coincideCategoria && coincideFecha;
  });
}

export async function corregirAsistencia(
  id: string,
  datos: DatosCorreccionAsistencia,
): Promise<RegistroAsistencia> {
  const fechaHora = new Date(datos.fechaHora);
  if (Number.isNaN(fechaHora.getTime())) {
    throw new Error("La fecha u hora seleccionada no es válida.");
  }

  const actualizado = await api<RegistroAsistencia>(`/asistencias/${id}`, {
    method: "PATCH",
    body: { fechaHora: fechaHora.toISOString(), metodo: datos.metodo },
  });
  asistencias.establecer(
    asistencias.obtener().map((registro) => (registro.id === id ? actualizado : registro)),
  );
  return actualizado;
}
