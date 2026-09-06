import { Sede } from "@/types";
import { MOCK_SEDES } from "@/lib/mock/sedes.mock";

const STORAGE_KEY = "kickstamp-sedes";
const SEDES_CHANGE_EVENT = "kickstamp:sedes-change";

let sedesCache: Sede[] | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function obtenerSedesIniciales(): Sede[] {
  return MOCK_SEDES;
}

function restaurarSedes(): Sede[] {
  const sedes = [...MOCK_SEDES];
  sedesCache = sedes;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sedes));
  return sedes;
}

// LEER
export function obtenerSedes(): Sede[] {
  if (!isBrowser()) return obtenerSedesIniciales();
  if (sedesCache) return sedesCache;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return restaurarSedes();
  }

  try {
    const sedes: unknown = JSON.parse(raw);
    if (!Array.isArray(sedes)) return restaurarSedes();

    sedesCache = sedes as Sede[];
    return sedesCache;
  } catch {
    return restaurarSedes();
  }
}

export function suscribirSedes(onStoreChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const handleChange = () => {
    sedesCache = null;
    onStoreChange();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) handleChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SEDES_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SEDES_CHANGE_EVENT, handleChange);
  };
}

// CREAR
export function crearSede(sede: Omit<Sede, "id">): Sede {
  const nueva: Sede = { ...sede, id: crypto.randomUUID() };
  const todas = obtenerSedes();
  guardarSedes([...todas, nueva]);
  return nueva;
}

// ACTUALIZAR
export function actualizarSede(id: string, cambios: Partial<Sede>): Sede | null {
  const sedes = obtenerSedes();
  const index = sedes.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const actualizada = { ...sedes[index], ...cambios };
  guardarSedes(sedes.map((sede, indice) => (indice === index ? actualizada : sede)));
  return actualizada;
}

// ELIMINAR
export function eliminarSede(id: string): boolean {
  const sedes = obtenerSedes();
  const nuevas = sedes.filter((s) => s.id !== id);
  if (nuevas.length === sedes.length) return false;

  guardarSedes(nuevas);
  return true;
}

function guardarSedes(sedes: Sede[]) {
  if (isBrowser()) {
    sedesCache = sedes;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sedes));
    window.dispatchEvent(new Event(SEDES_CHANGE_EVENT));
  }
}
