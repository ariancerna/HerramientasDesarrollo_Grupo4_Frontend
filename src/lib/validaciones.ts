/** Letras (con tildes y ñ), espacios, apóstrofo, punto o guion; igual que el backend. */
const NOMBRE_PERSONA = /^\p{L}[\p{L}' .-]*$/u;

/**
 * Valida un nombre o apellido. Devuelve el mensaje de error o null si es válido.
 * `campo` va en plural femenino/masculino según el texto: "Los nombres", "Los apellidos".
 */
export function errorNombrePersona(valor: string, campo: string, minimo = 2): string | null {
  const limpio = valor.trim();
  if (!limpio) return `${campo} son obligatorios.`;
  if (!NOMBRE_PERSONA.test(limpio)) return `${campo} solo pueden tener letras.`;
  if (limpio.length < minimo) return `${campo} deben tener al menos ${minimo} letras.`;
  if (limpio.length > 80) return `${campo} no pueden superar los 80 caracteres.`;
  return null;
}

/** Nombre completo de un profesor (una sola cadena). */
export function errorNombreCompleto(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return "El nombre es obligatorio.";
  if (!NOMBRE_PERSONA.test(limpio)) return "El nombre solo puede tener letras.";
  if (limpio.length < 3) return "El nombre debe tener al menos 3 letras.";
  return null;
}
