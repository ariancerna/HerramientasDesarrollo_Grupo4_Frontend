"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp } from "lucide-react";

export interface Columna<T> {
  clave: string;
  encabezado: string;
  celda: (fila: T) => ReactNode;
  /** Valor para ordenar; si falta, la columna no es ordenable. */
  orden?: (fila: T) => string | number;
  /** Clases extra de la celda (alineación, ancho, visibilidad por tamaño). */
  clase?: string;
}

interface TablaDatosProps<T> {
  filas: T[];
  columnas: Columna<T>[];
  claveFila: (fila: T) => string;
  onFilaClick?: (fila: T) => void;
  /** Versión en tarjeta para pantallas pequeñas. */
  tarjeta?: (fila: T) => ReactNode;
  vacio?: ReactNode;
  porPagina?: number;
  /** Columna por la que se ordena al inicio. */
  ordenInicial?: string;
  etiqueta: string;
}

const comparador = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

/** Tabla de datos del sistema: orden por columna, paginación y tarjetas en móvil. */
export function TablaDatos<T>({
  filas, columnas, claveFila, onFilaClick, tarjeta, vacio, porPagina = 10, ordenInicial, etiqueta,
}: TablaDatosProps<T>) {
  const [orden, setOrden] = useState<{ clave: string; asc: boolean } | null>(
    ordenInicial ? { clave: ordenInicial, asc: true } : null,
  );
  const [pagina, setPagina] = useState(0);

  const ordenadas = useMemo(() => {
    const columna = columnas.find((c) => c.clave === orden?.clave);
    if (!orden || !columna?.orden) return filas;
    const valor = columna.orden;
    return [...filas].sort((a, b) => {
      const va = valor(a);
      const vb = valor(b);
      const r = typeof va === "number" && typeof vb === "number" ? va - vb : comparador.compare(String(va), String(vb));
      return orden.asc ? r : -r;
    });
  }, [filas, columnas, orden]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas - 1);
  const visibles = ordenadas.slice(paginaActual * porPagina, (paginaActual + 1) * porPagina);
  const desde = ordenadas.length ? paginaActual * porPagina + 1 : 0;
  const hasta = Math.min(ordenadas.length, (paginaActual + 1) * porPagina);

  const alternarOrden = (clave: string) =>
    setOrden((actual) => (actual?.clave === clave ? { clave, asc: !actual.asc } : { clave, asc: true }));

  if (filas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center text-sm text-body">
        {vacio ?? "No hay registros para mostrar."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      {tarjeta && (
        <ul className="divide-y divide-line md:hidden">
          {visibles.map((fila) => (
            <li key={claveFila(fila)}>
              <button type="button" onClick={() => onFilaClick?.(fila)} className="w-full px-4 py-3 text-left transition-colors hover:bg-surface-muted">
                {tarjeta(fila)}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={`overflow-x-auto ${tarjeta ? "hidden md:block" : ""}`}>
        <table className="w-full border-collapse text-left text-sm" aria-label={etiqueta}>
          <thead>
            <tr className="border-b border-line bg-surface-muted/60">
              {columnas.map((columna) => {
                const activa = orden?.clave === columna.clave;
                const Icono = !activa ? ChevronsUpDown : orden.asc ? ChevronUp : ChevronDown;
                return (
                  <th
                    key={columna.clave}
                    scope="col"
                    aria-sort={activa ? (orden.asc ? "ascending" : "descending") : undefined}
                    className={`whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted ${columna.clase ?? ""}`}
                  >
                    {columna.orden ? (
                      <button type="button" onClick={() => alternarOrden(columna.clave)} className="inline-flex items-center gap-1 uppercase hover:text-ink">
                        {columna.encabezado}
                        <Icono className={`h-3.5 w-3.5 ${activa ? "text-ink" : "opacity-50"}`} />
                      </button>
                    ) : (
                      columna.encabezado
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visibles.map((fila) => (
              <tr
                key={claveFila(fila)}
                onClick={() => onFilaClick?.(fila)}
                className={`transition-colors hover:bg-surface-muted/70 ${onFilaClick ? "cursor-pointer" : ""}`}
              >
                {columnas.map((columna) => (
                  <td key={columna.clave} className={`px-4 py-3 text-ink ${columna.clase ?? ""}`}>
                    {columna.celda(fila)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-body">
        <span className="num">
          {desde}–{hasta} de {ordenadas.length}
        </span>
        {totalPaginas > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPagina(paginaActual - 1)}
              disabled={paginaActual === 0}
              aria-label="Página anterior"
              className="grid h-8 w-8 place-items-center rounded-md border border-line text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="num px-2">
              Página {paginaActual + 1} de {totalPaginas}
            </span>
            <button
              type="button"
              onClick={() => setPagina(paginaActual + 1)}
              disabled={paginaActual >= totalPaginas - 1}
              aria-label="Página siguiente"
              className="grid h-8 w-8 place-items-center rounded-md border border-line text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
