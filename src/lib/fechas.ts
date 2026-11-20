/**
 * Fechas de negocio en la zona horaria del club (America/Lima), igual que el backend.
 * Así "hoy" no depende de la zona horaria del equipo donde se abre la app.
 */
const ZONA_CLUB = "America/Lima";

/** YYYY-MM-DD de hoy (o del instante dado) en Lima. */
export function hoyEnLima(instante: Date = new Date()): string {
  const partes = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_CLUB, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(instante);
  const valor = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((parte) => parte.type === tipo)?.value ?? "";
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

/** HH:mm actual (o del instante dado) en Lima. */
export function horaEnLima(instante: Date = new Date()): string {
  const partes = new Intl.DateTimeFormat("en-GB", { timeZone: ZONA_CLUB, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(instante);
  const valor = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((parte) => parte.type === tipo)?.value ?? "";
  return `${valor("hour")}:${valor("minute")}`;
}

/** ¿La fecha (y la hora, si se indica) ya pasó en Lima? */
export function yaPaso(fecha: string, hora?: string, instante: Date = new Date()): boolean {
  const hoy = hoyEnLima(instante);
  if (fecha !== hoy) return fecha < hoy;
  return hora ? hora.slice(0, 5) <= horaEnLima(instante) : false;
}
