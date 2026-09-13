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
const BAR_HEIGHT = 76;
const QUIET_ZONE = 12;

type Bar = { x: number; width: number };

/** Genera un código Code 39 cuyo contenido escaneable es el DNI. */
export function DniBarcode({ dni }: { dni: string }) {
  const bars = crearBarras(dni);
  const ultimaBarra = bars[bars.length - 1];
  const width = ultimaBarra ? ultimaBarra.x + ultimaBarra.width + QUIET_ZONE : 200;

  return (
    <div className="rounded-xl border border-emerald-100 bg-[#f7fcf6] p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
      <div className="flex items-center gap-2 text-left">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#16794C] text-white" aria-hidden="true">
          <BarcodeIcon />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[#0A1628] dark:text-white">Mi código de barras</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Úsalo para identificarte en el club.</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white px-3 pb-2 pt-3 shadow-sm dark:bg-slate-50">
        <svg
          viewBox={`0 0 ${width} ${BAR_HEIGHT}`}
          role="img"
          aria-label={`Código de barras del DNI ${dni}`}
          className="h-20 w-full"
          preserveAspectRatio="none"
        >
          <title>Código de barras del DNI {dni}</title>
          {bars.map((bar, index) => (
            <rect key={`${bar.x}-${index}`} x={bar.x} y="0" width={bar.width} height={BAR_HEIGHT} fill="#0A1628" />
          ))}
        </svg>
        <p className="mt-1 text-center font-mono text-sm font-bold tracking-[0.28em] text-slate-900">{dni}</p>
      </div>
    </div>
  );
}

function crearBarras(dni: string): Bar[] {
  const caracteres = `*${dni.replace(/[^0-9]/g, "")}*`;
  const bars: Bar[] = [];
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

function BarcodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 5v14M7 5v14M10 5v14M14 5v14M17 5v14M20 5v14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
