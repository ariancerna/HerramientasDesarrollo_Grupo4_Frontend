"use client";

import { useState } from "react";
import { RotateCcw, Wallet } from "lucide-react";
import type { Student } from "@/types/student";
import type { PagoMensualidad } from "@/types/pago";
import { formatearMonto } from "@/store/pagos-store";
import { formatearFechaCorta } from "@/lib/formato";
import { TablaDatos, type Columna } from "@/components/ui/tabla-datos";
import { DatoDetalle, PanelLateral } from "@/components/ui/panel-lateral";
import { InsigniaEstado } from "@/components/ui/insignia-estado";
import UserAvatar from "@/components/shared/user-avatar";

interface Fila {
  alumno: Student;
  pago: PagoMensualidad | null;
}

interface PagosListaProps {
  filas: Fila[];
  montoBase: number;
  onRegistrar: (alumno: Student) => void;
  cargando?: boolean;
  onMarcarDeuda: (pago: PagoMensualidad, alumno: Student) => void;
}

const nombreCompleto = (alumno: Student) => `${alumno.nombres} ${alumno.apellidos}`;
const estadoDe = (pago: PagoMensualidad | null) => pago?.estado ?? "sin_cargo";

function Identidad({ alumno }: { alumno: Student }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar nombre={alumno.nombres} fotoUrl={alumno.fotoUrl} className="h-9 w-9 bg-brand-green-soft text-sm font-bold text-brand-green dark:text-brand-lime-light" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{nombreCompleto(alumno)}</p>
        <p className="truncate text-xs text-muted">{alumno.categoria || "Sin categoría"}</p>
      </div>
    </div>
  );
}

/** Mensualidades por alumno: tabla ordenable con detalle y acciones en un panel lateral. */
export function PagosLista({ filas, montoBase, onRegistrar, onMarcarDeuda, cargando = false }: PagosListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const seleccionada = filas.find((f) => f.alumno.id === seleccionadoId) ?? null;

  const columnas: Columna<Fila>[] = [
    { clave: "alumno", encabezado: "Alumno", celda: (f) => <Identidad alumno={f.alumno} />, orden: (f) => nombreCompleto(f.alumno) },
    { clave: "monto", encabezado: "Monto", celda: (f) => <span className="num">{formatearMonto(f.pago?.monto ?? montoBase)}</span>, orden: (f) => f.pago?.monto ?? montoBase },
    { clave: "metodo", encabezado: "Método", celda: (f) => f.pago?.metodoPago ?? <span className="text-muted">—</span>, clase: "hidden lg:table-cell" },
    { clave: "fecha", encabezado: "Fecha de pago", celda: (f) => (f.pago?.fechaPago ? formatearFechaCorta(f.pago.fechaPago) : <span className="text-muted">—</span>), orden: (f) => f.pago?.fechaPago ?? "", clase: "hidden lg:table-cell" },
    { clave: "estado", encabezado: "Estado", celda: (f) => <InsigniaEstado estado={estadoDe(f.pago)} />, orden: (f) => estadoDe(f.pago) },
    {
      clave: "accion",
      encabezado: "",
      clase: "w-36 text-right",
      celda: (f) =>
        f.pago?.estado === "pagado" ? null : (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRegistrar(f.alumno);
            }}
            className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            Registrar pago
          </button>
        ),
    },
  ];

  return (
    <>
      <TablaDatos
        cargando={cargando}
        etiqueta="Mensualidades"
        filas={filas}
        columnas={columnas}
        claveFila={(f) => f.alumno.id}
        ordenInicial="alumno"
        onFilaClick={(f) => setSeleccionadoId(f.alumno.id)}
        vacio="No se encontraron alumnos con esos filtros."
        tarjeta={(f) => (
          <div className="flex items-center justify-between gap-3">
            <Identidad alumno={f.alumno} />
            <InsigniaEstado estado={estadoDe(f.pago)} />
          </div>
        )}
      />

      <PanelLateral
        abierto={Boolean(seleccionada)}
        onCerrar={() => setSeleccionadoId(null)}
        titulo={seleccionada ? nombreCompleto(seleccionada.alumno) : ""}
        subtitulo={seleccionada?.alumno.categoria || "Sin categoría asignada"}
        pie={
          seleccionada &&
          (seleccionada.pago?.estado === "pagado" ? (
            <button type="button" onClick={() => onMarcarDeuda(seleccionada.pago!, seleccionada.alumno)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-muted">
              <RotateCcw className="h-4 w-4" /> Marcar como deuda
            </button>
          ) : (
            <button type="button" onClick={() => onRegistrar(seleccionada.alumno)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark">
              <Wallet className="h-4 w-4" /> Registrar pago
            </button>
          ))
        }
      >
        {seleccionada && (
          <>
            <div className="mb-4">
              <InsigniaEstado estado={estadoDe(seleccionada.pago)} />
            </div>
            <dl className="divide-y divide-line">
              <DatoDetalle etiqueta="Monto" valor={<span className="num">{formatearMonto(seleccionada.pago?.monto ?? montoBase)}</span>} />
              <DatoDetalle etiqueta="Método de pago" valor={seleccionada.pago?.metodoPago ?? "—"} />
              <DatoDetalle etiqueta="Código de operación" valor={seleccionada.pago?.codigoOperacion ?? "—"} />
              <DatoDetalle etiqueta="Fecha de pago" valor={seleccionada.pago?.fechaPago ? formatearFechaCorta(seleccionada.pago.fechaPago) : "—"} />
              <DatoDetalle etiqueta="Vencimiento" valor={seleccionada.pago?.vencimiento ? formatearFechaCorta(seleccionada.pago.vencimiento) : "—"} />
              <DatoDetalle etiqueta="DNI" valor={<span className="num">{seleccionada.alumno.dni}</span>} />
            </dl>
          </>
        )}
      </PanelLateral>
    </>
  );
}
