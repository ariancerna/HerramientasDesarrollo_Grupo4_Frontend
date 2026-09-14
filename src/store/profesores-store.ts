import { Profesor } from "@/types";
import { MOCK_PROFESORES } from "@/lib/mock/profesores.mock";
import { readJsonList, writeJson } from "@/lib/storage";
import { isProfesor } from "@/lib/storage-validators";

const STORAGE_KEY = "kickstamp-profesores";
const PROFESORES_CHANGE_EVENT = "kickstamp:profesores-change";

let profesoresCache: Profesor[] | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function obtenerProfesoresIniciales(): Profesor[] {
  return MOCK_PROFESORES;
}

// LEER
export function obtenerProfesores(): Profesor[] {
  if (!isBrowser()) return obtenerProfesoresIniciales();
  if (profesoresCache) return profesoresCache;

  const profesores = readJsonList(STORAGE_KEY, MOCK_PROFESORES, isProfesor);
  profesoresCache = profesores;
  return profesoresCache;
}

export function suscribirProfesores(onStoreChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const handleChange = () => {
    profesoresCache = null;
    onStoreChange();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) handleChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PROFESORES_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PROFESORES_CHANGE_EVENT, handleChange);
  };
}

/** Verifica si un nombre de usuario ya está en uso (por otro profesor). */
export function usuarioProfesorDisponible(usuario: string, idAExcluir?: string): boolean {
  return !obtenerProfesores().some(
    (p) => p.usuario.toLowerCase() === usuario.toLowerCase() && p.id !== idAExcluir,
  );
}

// CREAR
export function crearProfesor(profesor: Omit<Profesor, "id">): Profesor {
  const nuevo: Profesor = { ...profesor, id: crypto.randomUUID() };
  const todos = obtenerProfesores();
  guardarProfesores([...todos, nuevo]);
  return nuevo;
}

// ACTUALIZAR
export function actualizarProfesor(id: string, cambios: Partial<Profesor>): Profesor | null {
  const profesores = obtenerProfesores();
  const index = profesores.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const actualizado = { ...profesores[index], ...cambios };
  guardarProfesores(
    profesores.map((profesor, indice) => (indice === index ? actualizado : profesor)),
  );
  return actualizado;
}

// ELIMINAR
export function eliminarProfesor(id: string): boolean {
  const profesores = obtenerProfesores();
  const nuevos = profesores.filter((p) => p.id !== id);
  if (nuevos.length === profesores.length) return false;

  guardarProfesores(nuevos);
  return true;
}

/** Busca por nombre o usuario. */
export function filtrarProfesores(profesores: Profesor[], texto: string): Profesor[] {
  const termino = texto.trim().toLowerCase();
  if (!termino) return profesores;

  return profesores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(termino) || p.usuario.toLowerCase().includes(termino),
  );
}

function guardarProfesores(profesores: Profesor[]) {
  if (isBrowser()) {
    profesoresCache = profesores;
    writeJson(STORAGE_KEY, profesores);
    window.dispatchEvent(new Event(PROFESORES_CHANGE_EVENT));
  }
}
