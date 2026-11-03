import type { ReactNode } from "react";

type Tono = "azul" | "verde" | "ambar" | "rojo" | "neutro";

const TONOS: Record<Tono, string> = {
  azul: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  verde: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  ambar: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  rojo: "bg-red-500/10 text-red-600 dark:text-red-300",
  neutro: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

interface IndicadorProps {
  etiqueta: string;
  valor: ReactNode;
  /** Texto de contexto bajo el valor (por ejemplo, "de 15 registrados"). */
  detalle?: string;
  icono: ReactNode;
  tono?: Tono;
  /** Muestra un esqueleto mientras los datos aún no llegan. */
  cargando?: boolean;
}

/** Tarjeta de indicador única para todos los módulos (ícono, valor y contexto). */
export function Indicador({ etiqueta, valor, detalle, icono, tono = "azul", cargando = false }: IndicadorProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm sm:p-5">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${TONOS[tono]}`}>{icono}</span>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-body">{etiqueta}</p>
        {cargando ? (
          <span className="mt-1.5 block h-6 w-16 animate-pulse rounded-md bg-surface-muted" />
        ) : (
          <p className="num mt-0.5 truncate text-[22px] font-bold leading-tight text-ink">{valor}</p>
        )}
        {detalle && !cargando && <p className="truncate text-xs text-muted">{detalle}</p>}
      </div>
    </div>
  );
}
