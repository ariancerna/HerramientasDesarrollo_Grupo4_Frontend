"use client";

import { useState } from "react";
import type { RegistroAsistencia } from "@/store/asistencia-store";

interface AsistenciaListaProps {
  registros: RegistroAsistencia[];
  onCorregir: (registro: RegistroAsistencia) => void;
}

export function AsistenciaLista({ registros, onCorregir }: AsistenciaListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const seleccionado = registros.find((r) => r.id === seleccionadoId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      {/* LISTA */}
      <div className="space-y-2.5">
        {registros.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No se encontraron registros con esos filtros.
          </div>
        )}

        {registros.map((registro) => {
          const activo = seleccionadoId === registro.id;
          return (
            <button
              key={registro.id}
              type="button"
              onClick={() => setSeleccionadoId(registro.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                activo
                  ? "border-brand-green ring-2 ring-brand-green/20"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
              }`}
            >
              <Avatar nombre={registro.estudiante} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                  {registro.estudiante}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-brand-green dark:text-brand-lime-light">
                  {registro.categoria}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  DNI {registro.dni} · {formatearFechaHora(registro.fechaHora)}
                </p>
              </div>

              <MetodoBadge metodo={registro.metodo} />
            </button>
          );
        })}
      </div>

      {/* DETALLE */}
      <div className="xl:sticky xl:top-6">
        {seleccionado ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3 bg-brand-green px-5 py-4">
              <Avatar nombre={seleccionado.estudiante} onDark />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-white">
                  {seleccionado.estudiante}
                </p>
                <p className="truncate text-xs font-medium text-white/80">{seleccionado.categoria}</p>
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
              <DetalleCampo label="DNI" value={seleccionado.dni} />
              <DetalleCampo
                label="Método"
                value={seleccionado.metodo === "ESCANEO" ? "Escaneo" : "Manual"}
              />
              <DetalleCampo label="Fecha y hora" value={formatearFechaHora(seleccionado.fechaHora)} full />
            </div>

            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={() => onCorregir(seleccionado)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
              >
                <EditIcon />
                Corregir registro
              </button>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <ClipboardIcon />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Selecciona un registro
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

function Avatar({ nombre, onDark }: { nombre: string; onDark?: boolean }) {
  const partes = nombre.trim().split(/\s+/);
  const inicial = `${partes[0]?.charAt(0) ?? ""}${partes[1]?.charAt(0) ?? ""}`.toUpperCase();
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

function MetodoBadge({ metodo }: { metodo: "ESCANEO" | "MANUAL" }) {
  return (
    <span className="shrink-0 rounded-full bg-brand-green-soft px-2.5 py-1 text-xs font-extrabold text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
      {metodo === "ESCANEO" ? "Escaneo" : "Manual"}
    </span>
  );
}

function DetalleCampo({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function formatearFechaHora(fechaHora: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fechaHora));
}

/* ICONOS */

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="5" y="4.5" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 4.5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 11h7M8.5 15h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}