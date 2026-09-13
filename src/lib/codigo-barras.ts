const CODE_39_PATTERNS: Record<string, string> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  "*": "nwnnwnwnn",
};

const NARROW_BAR_WIDTH = 2;
const WIDE_BAR_WIDTH = NARROW_BAR_WIDTH * 3;
export const BARCODE_HEIGHT = 76;
const QUIET_ZONE = 12;

export type BarcodeBar = { x: number; width: number };

/** Crea un Code 39 cuyo contenido escaneable es exclusivamente el DNI. */
export function crearBarrasCodigoDni(dni: string): BarcodeBar[] {
  const caracteres = `*${dni.replace(/[^0-9]/g, "")}*`;
  const bars: BarcodeBar[] = [];
  let x = QUIET_ZONE;

  for (const caracter of caracteres) {
    const patron = CODE_39_PATTERNS[caracter] ?? CODE_39_PATTERNS["*"];

    [...patron].forEach((ancho, index) => {
      const width = ancho === "w" ? WIDE_BAR_WIDTH : NARROW_BAR_WIDTH;
      if (index % 2 === 0) bars.push({ x, width });
      x += width;
    });
    x += NARROW_BAR_WIDTH;
  }

  return bars;
}

export function obtenerAnchoCodigoBarras(bars: BarcodeBar[]): number {
  const ultimaBarra = bars[bars.length - 1];
  return ultimaBarra ? ultimaBarra.x + ultimaBarra.width + QUIET_ZONE : 200;
}
