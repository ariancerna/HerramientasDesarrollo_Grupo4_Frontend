"use client";

import { useState } from "react";
import type { Student } from "@/types/student";
import type { PagoMensualidad } from "@/types/pago";
import { formatearMonto } from "@/store/pagos-store";

interface Fila {
  alumno: Student;
  pago: PagoMensualidad | null;
}

interface PagosListaProps {
  filas: Fila[];
  montoBase: number;
  onRegistrar: (alumno: Student) => void;
  onMarcarDeuda: (pago: PagoMensualidad, alumno: Student) => void;
}

export function PagosLista({ filas, montoBase, onRegistrar, onMarcarDeuda }: PagosListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const seleccionada = filas.find((f) => f.alumno.id === seleccionadoId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      {/* LISTA */}
      <div className="space-y-2.5">
        {filas.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No se encontraron alumnos con esos filtros.
          </div>
        )}

        {filas.map(({ alumno, pago }) => {
          const activo = seleccionadoId === alumno.id;
          return (
            <button
              key={alumno.id}
              type="button"
              onClick={() => setSeleccionadoId(alumno.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                activo
                  ? "border-brand-green ring-2 ring-brand-green/20"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
              }`}
            >
              <Avatar nombre={alumno.nombres} apellido={alumno.apellidos} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                  {alumno.nombres} {alumno.apellidos}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-brand-green dark:text-brand-lime-light">
                  {alumno.categoria}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {alumno.codigo} · {formatearMonto(pago?.monto ?? montoBase)}
                </p>
              </div>

              <EstadoBadge pago={pago} />
            </button>
          );
        })}
      </div>

      {/* DETALLE */}
      <div className="xl:sticky xl:top-6">
        {seleccionada ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3 bg-brand-green px-5 py-4">
              <Avatar
                nombre={seleccionada.alumno.nombres}
                apellido={seleccionada.alumno.apellidos}
                onDark
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-white">
                  {seleccionada.alumno.nombres} {seleccionada.alumno.apellidos}
                </p>
                <p className="truncate text-xs font-medium text-white/80">
                  {seleccionada.alumno.categoria}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSeleccionadoId(null)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Cerrar detalle"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5">
              <DetalleCampo label="DNI" value={seleccionada.alumno.dni} />
              <DetalleCampo label="Código" value={seleccionada.alumno.codigo} />
              <DetalleCampo
                label="Monto"
                value={formatearMonto(seleccionada.pago?.monto ?? montoBase)}
              />
              <DetalleCampo
                label="Método"
                value={seleccionada.pago?.metodoPago ?? "—"}
              />
              <DetalleCampo label="Correo" value={seleccionada.alumno.email} full />
            </div>

            <div className="px-5 pb-5">
              {seleccionada.pago?.estado === "pagado" ? (
                <button
                  type="button"
                  onClick={() => onMarcarDeuda(seleccionada.pago!, seleccionada.alumno)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Marcar como deuda
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRegistrar(seleccionada.alumno)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
                >
                  Registrar pago
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <CardIcon />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Selecciona un alumno
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Toca cualquier tarjeta de la lista para ver su detalle aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* PIEZAS */

function Avatar({
  nombre,
  apellido,
  onDark,
}: {
  nombre: string;
  apellido: string;
  onDark?: boolean;
}) {
  const inicial = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  return (
    <span
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
        onDark
          ? "bg-white/20 text-white"
          : "bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"
      }`}
    >
      {inicial}
    </span>
  );
}

function EstadoBadge({ pago }: { pago: PagoMensualidad | null }) {
  const pagado = pago?.estado === "pagado";
  const vencido = pago?.estado === "vencido";

  const label = pagado ? "Pagado" : vencido ? "Vencido" : pago ? "Por pagar" : "Sin registro";
  const clases = pagado
    ? "bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"
    : vencido
      ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
      : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";

  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${clases}`}>
      {label}
    </span>
  );
}

function DetalleCampo({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

/* ICONOS */

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}