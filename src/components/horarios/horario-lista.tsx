"use client";

import { useState } from "react";
import { HorarioAsignado, NOMBRES_DIAS } from "@/types/horario";

interface HorarioListaProps {
  horarios: HorarioAsignado[];
}

export function HorarioLista({ horarios }: HorarioListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const seleccionado =
    horarios.find((h) => `${h.categoriaId}-${h.id}` === seleccionadoId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
      {/* LISTA */}
      <div className="space-y-2.5">
        {horarios.map((horario) => {
          const clave = `${horario.categoriaId}-${horario.id}`;
          const activo = seleccionadoId === clave;
          const estaActivo = horario.estado === "activo";

          return (
            <button
              key={clave}
              type="button"
              onClick={() => setSeleccionadoId(clave)}
              className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                activo
                  ? "border-brand-green ring-2 ring-brand-green/20"
                  : estaActivo
                    ? "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                    : "border-red-200 bg-red-50/40 dark:border-red-500/30 dark:bg-red-500/10"
              }`}
            >
              <div className="grid h-12 w-16 shrink-0 place-items-center rounded-xl bg-brand-green-soft text-center dark:bg-brand-green/15">
                <span className="text-[11px] font-extrabold uppercase text-brand-green dark:text-brand-lime-light">
                  {NOMBRES_DIAS[horario.dia].slice(0, 3)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                  {horario.categoria}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {horario.horaInicio} – {horario.horaFin} · {horario.cancha ?? "Cancha por confirmar"}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                  estaActivo
                    ? "bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"
                    : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                }`}
              >
                {estaActivo ? "Activo" : "Cancelado"}
              </span>
            </button>
          );
        })}
      </div>

      {/* DETALLE */}
      <div className="xl:sticky xl:top-6">
        {seleccionado ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3 bg-brand-green px-5 py-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 text-white">
                <ClockIcon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-white">{seleccionado.categoria}</p>
                <p className="truncate text-xs font-medium text-white/80">
                  {NOMBRES_DIAS[seleccionado.dia]}
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
              <DetalleCampo label="Horario" value={`${seleccionado.horaInicio} – ${seleccionado.horaFin}`} full />
              <DetalleCampo label="Cancha" value={seleccionado.cancha ?? "Por confirmar"} />
              <DetalleCampo
                label="Estado"
                value={seleccionado.estado === "activo" ? "Activo" : "Cancelado"}
              />
            </div>

            {seleccionado.estado !== "activo" && (
              <div className="mx-5 mb-5 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-300">
                Este entrenamiento está cancelado por administración.
              </div>
            )}
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <ClockIcon />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Selecciona un entrenamiento
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

function DetalleCampo({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}