import {
  Student,
  StudentFormData,
  StudentProfileData,
} from "@/types/student";
import { MOCK_ALUMNOS } from "@/lib/mock/alumnos.mock";

const STORAGE_KEY = "kickstamp-alumnos";

export function crearCodigoAlumno(dni: string): string {
  return `GC-${dni.replace(/\D/g, "")}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function crearId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Obtiene la lista de alumnos desde localStorage. La primera vez que se
 * llama, siembra el storage con los datos de ejemplo (MOCK_ALUMNOS).
 */
export function obtenerAlumnos(): Student[] {
  if (!isBrowser()) return MOCK_ALUMNOS;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ALUMNOS));
    return MOCK_ALUMNOS;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return MOCK_ALUMNOS;

    const alumnos = (parsed as Student[]).map((alumno) => ({
      ...alumno,
      codigo: crearCodigoAlumno(alumno.dni),
    }));
    // Migra los códigos creados con el formato anterior al nuevo GC-DNI.
    if (alumnos.some((alumno, index) => alumno.codigo !== parsed[index].codigo)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alumnos));
    }
    return alumnos;
  } catch {
    return MOCK_ALUMNOS;
  }
}

export function obtenerAlumnoPorId(id: string): Student | undefined {
  return obtenerAlumnos().find((alumno) => alumno.id === id);
}

function guardarAlumnos(alumnos: Student[]) {
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alumnos));
  }
}

/** US-04: crea un nuevo alumno. */
export function crearAlumno(data: StudentFormData): Student {
  const nuevo: Student = { ...data, codigo: crearCodigoAlumno(data.dni), id: crearId() };
  guardarAlumnos([nuevo, ...obtenerAlumnos()]);
  return nuevo;
}

/** US-04: actualiza los datos de un alumno existente. */
export function actualizarAlumno(
  id: string,
  data: StudentFormData,
): Student | null {
  const alumnos = obtenerAlumnos();
  const index = alumnos.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const actualizado: Student = {
    ...alumnos[index],
    ...data,
    codigo: crearCodigoAlumno(data.dni),
    id,
  };
  const nuevaLista = [...alumnos];
  nuevaLista[index] = actualizado;
  guardarAlumnos(nuevaLista);
  return actualizado;
}

/** Actualiza únicamente los datos que el alumno puede gestionar desde su perfil. */
export function actualizarPerfilAlumno(
  id: string,
  data: StudentProfileData,
): Student | null {
  const alumnos = obtenerAlumnos();
  const index = alumnos.findIndex((alumno) => alumno.id === id);

  if (index === -1) return null;

  const actualizado: Student = {
    ...alumnos[index],
    nombres: data.nombres.trim(),
    apellidos: data.apellidos.trim(),
    email: data.email.trim(),
    telefono: data.telefono?.trim() || undefined,
    fotoUrl: data.fotoUrl || undefined,
  };
  const nuevaLista = [...alumnos];
  nuevaLista[index] = actualizado;
  guardarAlumnos(nuevaLista);

  return actualizado;
}

/** US-04: elimina un alumno por id. */
export function eliminarAlumno(id: string): void {
  guardarAlumnos(obtenerAlumnos().filter((a) => a.id !== id));
}

/** US-05: busca por texto (nombres, apellidos, DNI o código) y filtra por categoría/estado. */
export function filtrarAlumnos(
  alumnos: Student[],
  opciones: {
    texto?: string;
    categoria?: string;
    estado?: Student["estado"] | "todos";
  },
): Student[] {
  const texto = opciones.texto?.trim().toLowerCase() ?? "";
  const categoria = opciones.categoria ?? "todas";
  const estado = opciones.estado ?? "todos";

  return alumnos.filter((a) => {
    const coincideTexto =
      texto === "" ||
      a.nombres.toLowerCase().includes(texto) ||
      a.apellidos.toLowerCase().includes(texto) ||
      a.dni.includes(texto) ||
      a.codigo.toLowerCase().includes(texto);

    const coincideCategoria = categoria === "todas" || a.categoria === categoria;
    const coincideEstado = estado === "todos" || a.estado === estado;

    return coincideTexto && coincideCategoria && coincideEstado;
  });
}
