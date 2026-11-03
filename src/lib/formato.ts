/**
 * Formatos únicos de fecha y hora para toda la aplicación (es-PE):
 * fecha corta "lun. 2 nov.", fecha larga "lunes 2 de noviembre" y hora "5:00 p. m.".
 */

const fechaCorta = new Intl.DateTimeFormat("es-PE", { weekday: "short", day: "numeric", month: "short" });
const fechaLarga = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" });
const diaMes = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short" });
const hora = new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit", hour12: true });

/** "2026-11-02" se interpreta al mediodía local para no cambiar de día por la zona horaria. */
function aFecha(valor: string | Date) {
  if (valor instanceof Date) return valor;
  return /^\d{4}-\d{2}-\d{2}$/.test(valor) ? new Date(`${valor}T12:00:00`) : new Date(valor);
}

function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export const formatearFechaCorta = (valor: string | Date) => fechaCorta.format(aFecha(valor));
export const formatearFechaLarga = (valor: string | Date) => capitalizar(fechaLarga.format(aFecha(valor)));
export const formatearDiaMes = (valor: string | Date) => diaMes.format(aFecha(valor));

/** Acepta "17:00", "17:00:00" o una fecha ISO. */
export function formatearHora(valor: string | Date) {
  if (typeof valor === "string" && /^\d{2}:\d{2}/.test(valor)) {
    const [h, m] = valor.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return hora.format(d);
  }
  return hora.format(aFecha(valor));
}

export function formatearRangoHoras(inicio: string, fin?: string | null) {
  return fin ? `${formatearHora(inicio)} – ${formatearHora(fin)}` : formatearHora(inicio);
}

export const formatearFechaHora = (valor: string | Date) => `${formatearFechaCorta(valor)} · ${formatearHora(valor)}`;

/** "YYYY-MM-DD" en la zona horaria del navegador. */
export function fechaISO(fecha: Date) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

export function saludoSegunHora(fecha = new Date()) {
  const h = fecha.getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}
