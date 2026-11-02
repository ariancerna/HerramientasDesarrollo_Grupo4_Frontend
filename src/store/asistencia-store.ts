import {
  DatosCorreccionAsistencia,
  EstudianteAsistencia,
  FiltrosAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
} from "@/types/asistencia";
import { api, ApiError, apiTodasLasPaginas } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";
import { getSession } from "@/store/auth-store";

export type {
  DatosCorreccionAsistencia,
  EstudianteAsistencia,
  FiltrosAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
} from "@/types/asistencia";

/** Registro tal como lo devuelve el backend (la categoría puede faltar). */
type RegistroApi = Omit<RegistroAsistencia, "categoria"> & { categoria: string | null };

function aRegistro(registro: RegistroApi): RegistroAsistencia {
  return { ...registro, categoria: registro.categoria ?? "" };
}

// ADM y PROF consultan todos los registros; el alumno, solo los suyos en /me/asistencias.
const asistencias = crearColeccionRemota<RegistroAsistencia>("asistencias", async () => {
  const ruta = getSession()?.usuario.rol === "alumno" ? "/me/asistencias" : "/asistencias";
  return (await apiTodasLasPaginas<RegistroApi>(ruta)).map(aRegistro);
});

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
  categoria: string | null;
  estado: "activo" | "inactivo";
}

/** Busca un alumno por DNI para registrar su asistencia; undefined si no existe. */
export async function buscarEstudiantePorDni(dni: string): Promise<EstudianteAsistencia | undefined> {
  try {
    const alumno = await api<AlumnoPorDniApi>(`/alumnos/dni/${dni}`);
    return {
      id: alumno.id,
      dni: alumno.dni,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      categoria: alumno.categoria ?? "",
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
  const registro = aRegistro(
    await api<RegistroApi>("/asistencias", {
      method: "POST",
      body: { estudianteId: estudiante.id, metodo, fechaHora },
    }),
  );
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

  const actualizado = aRegistro(
    await api<RegistroApi>(`/asistencias/${id}`, {
      method: "PATCH",
      body: { fechaHora: fechaHora.toISOString(), metodo: datos.metodo },
    }),
  );
  asistencias.establecer(
    asistencias.obtener().map((registro) => (registro.id === id ? actualizado : registro)),
  );
  return actualizado;
}
