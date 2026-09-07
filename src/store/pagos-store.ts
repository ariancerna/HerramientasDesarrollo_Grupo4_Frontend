import { MOCK_PAGOS } from "@/lib/mock/pagos.mock";
import type { PagoMensualidad } from "@/types/pago";

export function obtenerPagosPorEstudiante(
  estudianteId: string,
): PagoMensualidad[] {
  return MOCK_PAGOS.filter((pago) => pago.estudianteId === estudianteId).sort(
    (a, b) => b.periodo.localeCompare(a.periodo),
  );
}

export function obtenerMensualidadActual(
  estudianteId: string,
): PagoMensualidad | undefined {
  return obtenerPagosPorEstudiante(estudianteId)[0];
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
