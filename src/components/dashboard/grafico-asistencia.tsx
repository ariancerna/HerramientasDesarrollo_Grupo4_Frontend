"use client";

import { useMemo, useState } from "react";
import { fechaISO, formatearFechaCorta } from "@/lib/formato";

interface GraficoAsistenciaProps {
  /** Fechas y horas (ISO) de cada registro de asistencia. */
  registros: string[];
  dias?: number;
}

const ALTO = 180;
const MARGEN = { arriba: 12, abajo: 28, izquierda: 30, derecha: 8 };

/** Barras de asistencias por día (una sola serie, sin leyenda: el título la nombra). */
export function GraficoAsistencia({ registros, dias = 14 }: GraficoAsistenciaProps) {
  const [activo, setActivo] = useState<number | null>(null);

  const datos = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const registro of registros) {
      const dia = fechaISO(new Date(registro));
      conteo.set(dia, (conteo.get(dia) ?? 0) + 1);
    }
    const hoy = new Date();
    return Array.from({ length: dias }, (_, i) => {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - (dias - 1 - i));
      const clave = fechaISO(fecha);
      return { clave, fecha, total: conteo.get(clave) ?? 0 };
    });
  }, [registros, dias]);

  const maximo = Math.max(4, ...datos.map((d) => d.total));
  const tope = Math.ceil(maximo / 4) * 4; // escala con 4 divisiones enteras
  const ancho = 640;
  const areaAncho = ancho - MARGEN.izquierda - MARGEN.derecha;
  const areaAlto = ALTO - MARGEN.arriba - MARGEN.abajo;
  const paso = areaAncho / datos.length;
  const barra = Math.min(28, paso - 6);
  const y = (valor: number) => MARGEN.arriba + areaAlto - (valor / tope) * areaAlto;
  const total = datos.reduce((suma, d) => suma + d.total, 0);
  const seleccionado = activo === null ? null : datos[activo];

  return (
    <div className="relative">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="text-xs text-body">
          <span className="num text-lg font-bold text-ink">{total}</span> registros en los últimos {dias} días
        </p>
        <p className="min-h-4 text-xs font-medium text-ink" aria-live="polite">
          {seleccionado ? `${formatearFechaCorta(seleccionado.fecha)}: ${seleccionado.total} ${seleccionado.total === 1 ? "asistencia" : "asistencias"}` : ""}
        </p>
      </div>

      <svg viewBox={`0 0 ${ancho} ${ALTO}`} className="h-auto w-full" role="img" aria-label={`Asistencias por día en los últimos ${dias} días`}>
        {[0, 0.5, 1].map((fraccion) => {
          const valor = Math.round(tope * fraccion);
          return (
            <g key={fraccion}>
              <line x1={MARGEN.izquierda} x2={ancho - MARGEN.derecha} y1={y(valor)} y2={y(valor)} className="stroke-line" strokeWidth={1} strokeDasharray={fraccion === 0 ? undefined : "3 4"} />
              <text x={MARGEN.izquierda - 8} y={y(valor) + 4} textAnchor="end" className="fill-muted text-[11px]">{valor}</text>
            </g>
          );
        })}

        {datos.map((d, i) => {
          const x = MARGEN.izquierda + i * paso + (paso - barra) / 2;
          const alto = Math.max(0, y(0) - y(d.total));
          const esHoy = i === datos.length - 1;
          return (
            <g key={d.clave}>
              {d.total > 0 && (
                <path
                  d={`M${x},${y(0)} v${-(alto - 4)} q0,-4 4,-4 h${barra - 8} q4,0 4,4 v${alto - 4} z`}
                  className={`transition-opacity ${activo !== null && activo !== i ? "opacity-40" : ""} ${esHoy ? "fill-blue-700 dark:fill-blue-300" : "fill-[#2563eb] dark:fill-[#4f86f7]"}`}
                />
              )}
              {(i % 2 === datos.length % 2 || esHoy) && (
                <text x={x + barra / 2} y={ALTO - 10} textAnchor="middle" className={`text-[11px] ${esHoy ? "fill-ink font-semibold" : "fill-muted"}`}>
                  {esHoy ? "Hoy" : d.fecha.getDate()}
                </text>
              )}
              {/* Zona de interacción más grande que la barra. */}
              <rect
                x={MARGEN.izquierda + i * paso}
                y={MARGEN.arriba}
                width={paso}
                height={areaAlto}
                fill="transparent"
                onMouseEnter={() => setActivo(i)}
                onMouseLeave={() => setActivo(null)}
                onFocus={() => setActivo(i)}
                onBlur={() => setActivo(null)}
                tabIndex={0}
                aria-label={`${formatearFechaCorta(d.fecha)}: ${d.total} asistencias`}
              />
            </g>
          );
        })}
      </svg>

      <table className="sr-only">
        <caption>Asistencias por día</caption>
        <tbody>
          {datos.map((d) => (
            <tr key={d.clave}>
              <th scope="row">{formatearFechaCorta(d.fecha)}</th>
              <td>{d.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
