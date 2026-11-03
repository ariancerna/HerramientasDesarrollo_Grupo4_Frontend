import { AlertTriangle, CircleCheck, Clock, MinusCircle } from "lucide-react";

interface EstadoPagosProps {
  pagados: number;
  pendientes: number;
  vencidos: number;
  /** Alumnos activos sin cargo generado en el período. */
  sinCargo: number;
}

// Colores de estado reservados: siempre acompañados de ícono y etiqueta.
const SEGMENTOS = [
  { clave: "pagados", etiqueta: "Al día", Icono: CircleCheck, barra: "bg-emerald-600 dark:bg-emerald-500", icono: "text-emerald-600 dark:text-emerald-400" },
  { clave: "pendientes", etiqueta: "Pendientes", Icono: Clock, barra: "bg-amber-500 dark:bg-amber-400", icono: "text-amber-600 dark:text-amber-400" },
  { clave: "vencidos", etiqueta: "Vencidos", Icono: AlertTriangle, barra: "bg-red-600 dark:bg-red-500", icono: "text-red-600 dark:text-red-400" },
  { clave: "sinCargo", etiqueta: "Sin cargo", Icono: MinusCircle, barra: "bg-slate-300 dark:bg-slate-600", icono: "text-slate-500 dark:text-slate-400" },
] as const;

/** Proporción del estado de las mensualidades del mes (barra de partes de un todo). */
export function EstadoPagos(props: EstadoPagosProps) {
  const total = SEGMENTOS.reduce((suma, s) => suma + props[s.clave], 0);
  const alDia = total ? Math.round((props.pagados / total) * 100) : 0;

  return (
    <div>
      <p className="text-xs text-body">
        <span className="num text-lg font-bold text-ink">{alDia}%</span> de los alumnos está al día
      </p>

      <div className="mt-4 flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-surface-muted" role="img" aria-label={`Al día ${props.pagados}, pendientes ${props.pendientes}, vencidos ${props.vencidos}, sin cargo ${props.sinCargo}`}>
        {SEGMENTOS.filter((s) => props[s.clave] > 0).map((s) => (
          <span key={s.clave} className={`h-full ${s.barra}`} style={{ width: `${(props[s.clave] / total) * 100}%` }} title={`${s.etiqueta}: ${props[s.clave]}`} />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {SEGMENTOS.map(({ clave, etiqueta, Icono, icono }) => (
          <li key={clave} className="flex items-center gap-2">
            <Icono className={`h-4 w-4 shrink-0 ${icono}`} />
            <span className="text-xs text-body">{etiqueta}</span>
            <span className="num ml-auto text-sm font-semibold text-ink">{props[clave]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
