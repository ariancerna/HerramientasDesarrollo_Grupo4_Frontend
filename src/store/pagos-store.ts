import type { PagoMensualidad } from "@/types/pago";
import { api } from "@/lib/api";
import { crearColeccionRemota } from "@/lib/remote-collection";
import { getSession } from "@/store/auth-store";

/** Fila de `pagos` tal como la devuelve el backend. */
interface PagoApi {
  id: string;
  alumno_id: string;
  periodo: string;
  monto: number | string;
  estado: PagoMensualidad["estado"];
  fecha_pago: string | null;
  metodo_pago: PagoMensualidad["metodoPago"] | null;
  codigo_operacion: string | null;
  vencimiento: string | null;
}

function aPago(pago: PagoApi): PagoMensualidad {
  return {
    id: pago.id,
    estudianteId: pago.alumno_id,
    periodo: pago.periodo,
    concepto: `Mensualidad de ${formatearPeriodo(pago.periodo)}`,
    monto: Number(pago.monto),
    moneda: "PEN",
    vencimiento: pago.vencimiento ?? "",
    estado: pago.estado,
    fechaPago: pago.fecha_pago ?? undefined,
    metodoPago: pago.metodo_pago ?? undefined,
    codigoOperacion: pago.codigo_operacion ?? undefined,
  };
}

const pagos = crearColeccionRemota<PagoMensualidad>("pagos", async () => {
  // El alumno solo puede consultar su propio historial.
  const ruta = getSession()?.usuario.rol === "alumno" ? "/me/pagos" : "/pagos";
  return (await api<PagoApi[]>(ruta)).map(aPago);
});

export const obtenerPagosIniciales = pagos.obtenerInicial;

// LEER
export const obtenerPagos = pagos.obtener;
export const suscribirPagos = pagos.suscribir;

export function obtenerPagosPorEstudiante(estudianteId: string): PagoMensualidad[] {
  return obtenerPagos()
    .filter((pago) => pago.estudianteId === estudianteId)
    .sort((a, b) => b.periodo.localeCompare(a.periodo));
}

export function obtenerMensualidadActual(estudianteId: string): PagoMensualidad | undefined {
  return obtenerPagosPorEstudiante(estudianteId)[0];
}

/**
 * Registra el pago de la mensualidad de un alumno: el backend actualiza el
 * cargo del período si existe o lo crea ya pagado.
 */
export async function registrarPagoAlumno(
  estudianteId: string,
  periodo: string,
  metodoPago: NonNullable<PagoMensualidad["metodoPago"]>,
  codigoOperacion?: string,
): Promise<void> {
  await api("/pagos/registrar", {
    method: "POST",
    body: { estudianteId, periodo, metodoPago, codigoOperacion: codigoOperacion || undefined },
  });
  await pagos.recargar();
}

/** Revierte un pago registrado por error: vuelve a quedar como deuda pendiente. */
export async function marcarPagoPendiente(id: string): Promise<void> {
  await api(`/pagos/${id}/marcar-pendiente`, { method: "POST" });
  await pagos.recargar();
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
