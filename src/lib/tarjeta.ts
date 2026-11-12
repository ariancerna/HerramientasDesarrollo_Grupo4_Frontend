/** Utilidades de tarjeta para el checkout simulado (no se guarda ni se envía el número). */

export type MarcaTarjeta = "visa" | "mastercard" | "amex" | null;

export const TARJETAS_PRUEBA = {
  aprobada: "4242424242424242",
  rechazada: "4000020000000000",
} as const;

export function soloDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export function detectarMarca(digitos: string): MarcaTarjeta {
  if (/^4/.test(digitos)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digitos)) return "mastercard";
  if (/^3[47]/.test(digitos)) return "amex";
  return null;
}

export const NOMBRE_MARCA: Record<Exclude<MarcaTarjeta, null>, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
};

export function largoMaximo(marca: MarcaTarjeta) {
  return marca === "amex" ? 15 : 16;
}

export function largoCvc(marca: MarcaTarjeta) {
  return marca === "amex" ? 4 : 3;
}

/** "4242424242424242" → "4242 4242 4242 4242" (AMEX: 4-6-5). */
export function agruparNumero(digitos: string, marca: MarcaTarjeta) {
  const grupos = marca === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
  const partes: string[] = [];
  let inicio = 0;
  for (const largo of grupos) {
    if (inicio >= digitos.length) break;
    partes.push(digitos.slice(inicio, inicio + largo));
    inicio += largo;
  }
  return partes.join(" ");
}

/** Número para la tarjeta dibujada: lo escrito y el resto con puntos. */
export function numeroEnTarjeta(digitos: string, marca: MarcaTarjeta) {
  const largo = largoMaximo(marca);
  return agruparNumero((digitos + "•".repeat(largo)).slice(0, largo), marca);
}

/** Algoritmo de Luhn, el mismo control que hacen las pasarelas reales. */
export function numeroValido(digitos: string) {
  if (!/^\d{13,19}$/.test(digitos)) return false;
  let suma = 0;
  for (let i = 0; i < digitos.length; i += 1) {
    let d = Number(digitos[digitos.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    suma += d;
  }
  return suma % 10 === 0;
}

export function formatearVencimiento(valor: string) {
  const d = soloDigitos(valor).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function vencimientoValido(valor: string, hoy = new Date()) {
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(valor);
  if (!m) return false;
  const mes = Number(m[1]);
  const anio = 2000 + Number(m[2]);
  return anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1);
}
