export type MetodoAsistencia = "ESCANEO" | "MANUAL";

export interface EstudianteAsistencia {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  categoria: string;
  activo: boolean;
}

export interface RegistroAsistencia {
  id: string;
  estudianteId: string;
  dni: string;
  estudiante: string;
  categoria: string;
  fechaHora: string;
  metodo: MetodoAsistencia;
}

const STORAGE_KEY = "kickstamp-asistencias";

function leerRegistros(): RegistroAsistencia[] {
  if (typeof window === "undefined") return [];

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) return [];

  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as RegistroAsistencia[]) : [];
  } catch {
    return [];
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

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([registro, ...registros]),
  );

  return registro;
}
