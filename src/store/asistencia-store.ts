import {
  DatosCorreccionAsistencia,
  EstudianteAsistencia,
  FiltrosAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
} from "@/types/asistencia";
import { MOCK_ASISTENCIAS } from "@/lib/mock/asistencias.mock";

export type {
  DatosCorreccionAsistencia,
  EstudianteAsistencia,
  FiltrosAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
} from "@/types/asistencia";

const STORAGE_KEY = "kickstamp-asistencias";

function leerRegistros(): RegistroAsistencia[] {
  if (typeof window === "undefined") return MOCK_ASISTENCIAS;

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ASISTENCIAS));
    return MOCK_ASISTENCIAS;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as RegistroAsistencia[]) : [];
  } catch {
    return [];
  }
}

function guardarRegistros(registros: RegistroAsistencia[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
  }
}

function crearId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fechaLocal(fechaHora: string) {
  const fecha = new Date(fechaHora);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function registrarAsistencia(
  estudiante: EstudianteAsistencia,
  metodo: MetodoAsistencia,
  fechaHora = new Date().toISOString(),
): RegistroAsistencia {
  if (typeof window === "undefined") {
    throw new Error("El registro solo está disponible en el navegador.");
  }

  const registros = leerRegistros();
  const fechaRegistro = fechaLocal(fechaHora);
  const duplicado = registros.some(
    (registro) =>
      registro.estudianteId === estudiante.id &&
      fechaLocal(registro.fechaHora) === fechaRegistro,
  );

  if (duplicado) {
    throw new Error("Este estudiante ya tiene asistencia registrada en esa fecha.");
  }

  const registro: RegistroAsistencia = {
    id: crearId(),
    estudianteId: estudiante.id,
    dni: estudiante.dni,
    estudiante: `${estudiante.nombres} ${estudiante.apellidos}`,
    categoria: estudiante.categoria,
    fechaHora,
    metodo,
  };

  guardarRegistros([registro, ...registros]);

  return registro;
}

export function obtenerRegistrosAsistencia(): RegistroAsistencia[] {
  return leerRegistros();
}

export function obtenerAsistenciasPorEstudiante(
  estudianteId: string,
): RegistroAsistencia[] {
  return leerRegistros().filter(
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

export function corregirAsistencia(
  id: string,
  datos: DatosCorreccionAsistencia,
): RegistroAsistencia {
  if (typeof window === "undefined") {
    throw new Error("La corrección solo está disponible en el navegador.");
  }

  const registros = leerRegistros();
  const indice = registros.findIndex((registro) => registro.id === id);

  if (indice === -1) {
    throw new Error("No se encontró el registro de asistencia.");
  }

  const fechaHora = new Date(datos.fechaHora);
  if (Number.isNaN(fechaHora.getTime())) {
    throw new Error("La fecha u hora seleccionada no es válida.");
  }

  const registroActual = registros[indice];
  const fechaRegistro = fechaLocal(datos.fechaHora);
  const duplicado = registros.some(
    (registro) =>
      registro.id !== id &&
      registro.estudianteId === registroActual.estudianteId &&
      fechaLocal(registro.fechaHora) === fechaRegistro,
  );

  if (duplicado) {
    throw new Error("Este estudiante ya tiene asistencia registrada en esa fecha.");
  }

  const actualizado: RegistroAsistencia = {
    ...registroActual,
    fechaHora: datos.fechaHora,
    metodo: datos.metodo,
  };
  const nuevaLista = [...registros];
  nuevaLista[indice] = actualizado;
  guardarRegistros(nuevaLista);

  return actualizado;
}
