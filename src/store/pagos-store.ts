import { MOCK_PAGOS } from "@/lib/mock/pagos.mock";
import type { PagoMensualidad } from "@/types/pago";

const STORAGE_KEY = "kickstamp-pagos";
const PAGOS_CHANGE_EVENT = "kickstamp:pagos-change";

let pagosCache: PagoMensualidad[] | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function obtenerPagosIniciales(): PagoMensualidad[] {
  return MOCK_PAGOS;
}

function restaurarPagos(): PagoMensualidad[] {
  const pagos = [...MOCK_PAGOS];
  pagosCache = pagos;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pagos));
  return pagos;
}

// LEER
export function obtenerPagos(): PagoMensualidad[] {
  if (!isBrowser()) return obtenerPagosIniciales();
  if (pagosCache) return pagosCache;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return restaurarPagos();
  }

  try {
    const pagos: unknown = JSON.parse(raw);
    if (!Array.isArray(pagos)) return restaurarPagos();

    pagosCache = pagos as PagoMensualidad[];
    return pagosCache;
  } catch {
    return restaurarPagos();
  }
}

export function suscribirPagos(onStoreChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const handleChange = () => {
    pagosCache = null;
    onStoreChange();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) handleChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PAGOS_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PAGOS_CHANGE_EVENT, handleChange);
  };
}

export function obtenerPagosPorEstudiante(estudianteId: string): PagoMensualidad[] {
  return obtenerPagos()
    .filter((pago) => pago.estudianteId === estudianteId)
    .sort((a, b) => b.periodo.localeCompare(a.periodo));
}

export function obtenerMensualidadActual(estudianteId: string): PagoMensualidad | undefined {
  return obtenerPagosPorEstudiante(estudianteId)[0];
}

// CREAR (registrar un pago nuevo, ej. la mensualidad del mes)
export function crearPago(pago: Omit<PagoMensualidad, "id">): PagoMensualidad {
  const nuevo: PagoMensualidad = { ...pago, id: crypto.randomUUID() };
  const todos = obtenerPagos();
  guardarPagos([...todos, nuevo]);
  return nuevo;
}

// ACTUALIZAR (ej. marcar un pago pendiente como pagado, con fecha y método)
export function actualizarPago(id: string, cambios: Partial<PagoMensualidad>): PagoMensualidad | null {
  const pagos = obtenerPagos();
  const index = pagos.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const actualizado = { ...pagos[index], ...cambios };
  guardarPagos(pagos.map((pago, indice) => (indice === index ? actualizado : pago)));
  return actualizado;
}

/**
 * Registra el pago de una mensualidad ya existente: la marca como "pagado"
 * con fecha de hoy, método de pago y código de operación.
 */
export function registrarPagoMensualidad(
  id: string,
  metodoPago: PagoMensualidad["metodoPago"],
  codigoOperacion?: string,
): PagoMensualidad | null {
  return actualizarPago(id, {
    estado: "pagado",
    fechaPago: new Date().toISOString().slice(0, 10),
    metodoPago,
    codigoOperacion,
  });
}

// ELIMINAR
export function eliminarPago(id: string): boolean {
  const pagos = obtenerPagos();
  const nuevos = pagos.filter((p) => p.id !== id);
  if (nuevos.length === pagos.length) return false;

  guardarPagos(nuevos);
  return true;
}

function guardarPagos(pagos: PagoMensualidad[]) {
  if (isBrowser()) {
    pagosCache = pagos;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pagos));
    window.dispatchEvent(new Event(PAGOS_CHANGE_EVENT));
  }
}

export function formatearMonto(monto: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(monto);
}

export function formatearPeriodo(periodo: string) {
  const [year, month] = periodo.split("-").map(Number);
  const fecha = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(fecha);
}