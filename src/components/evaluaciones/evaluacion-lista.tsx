"use client";

import { useMemo, useState } from "react";
import type { Evaluacion } from "@/types/evaluacion";

interface EvaluacionListaProps {
  evaluaciones: Evaluacion[];
  nombresAlumnos: Record<string, string>;
  onEditar: (evaluacion: Evaluacion) => void;
  onEliminar: (evaluacion: Evaluacion) => void;
}

export function EvaluacionLista({
  evaluaciones,
  nombresAlumnos,
  onEditar,
  onEliminar,
}: EvaluacionListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [nivel, setNivel] = useState<"todos" | "alta" | "media" | "baja">("todos");

  const promedio = (e: Evaluacion) => {
    const notas = [e.rendimientoTecnico, e.rendimientoFisico, e.actitud].filter(
      (n): n is number => typeof n === "number",
    );
    if (notas.length === 0) return null;
    return notas.reduce((a, b) => a + b, 0) / notas.length;
  };

  const filtradas = useMemo(() => {
    const termino = texto.trim().toLowerCase();
    return evaluaciones.filter((evaluacion) => {
      const nombre = (nombresAlumnos[evaluacion.alumnoId] ?? "").toLowerCase();
      const coincideTexto =
        !termino ||
        nombre.includes(termino) ||
        evaluacion.observaciones.toLowerCase().includes(termino);
      const coincideDesde = !desde || evaluacion.fecha >= desde;
      const coincideHasta = !hasta || evaluacion.fecha <= hasta;

      const prom = promedio(evaluacion);
      const coincideNivel =
        nivel === "todos" ||
        (prom !== null &&
          ((nivel === "alta" && prom >= 7) ||
            (nivel === "media" && prom >= 5 && prom < 7) ||
            (nivel === "baja" && prom < 5)));

      return coincideTexto && coincideDesde && coincideHasta && coincideNivel;
    });
  }, [evaluaciones, texto, desde, hasta, nivel, nombresAlumnos]);

  const seleccionada = filtradas.find((e) => e.id === seleccionadoId) ?? null;

  return (
    <div>
      {/* FILTROS */}
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex-row lg:flex-wrap">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por alumno u observaciones..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:flex-1"
        />
        <input
          type="date"
          value={desde}
          max={hasta || undefined}
          onChange={(e) => setDesde(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-44"
        />
        <input
          type="date"
          value={hasta}
          min={desde || undefined}
          onChange={(e) => setHasta(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-44"
        />
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value as typeof nivel)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-48"
        >
          <option value="todos">Todos los promedios</option>
          <option value="alta">Alto (7 a 10)</option>
          <option value="media">Medio (5 a 6.9)</option>
          <option value="baja">Bajo (menos de 5)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      {/* LISTA */}
      <div className="space-y-2.5">
        {filtradas.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No se encontraron evaluaciones con esos filtros.
          </div>
        )}

        {filtradas.map((evaluacion) => {
          const activo = seleccionadoId === evaluacion.id;
          const nombre = nombresAlumnos[evaluacion.alumnoId] ?? "Alumno";
          const prom = promedio(evaluacion);

          return (
            <button
              key={evaluacion.id}
              type="button"
              onClick={() => setSeleccionadoId(evaluacion.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                activo
                  ? "border-brand-green ring-2 ring-brand-green/20"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
              }`}
            >
              <Avatar nombre={nombre} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                  {nombre}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {formatearFecha(evaluacion.fecha)}
                </p>
              </div>

              {prom !== null && <NotaBadge nota={prom} />}
            </button>
          );
        })}
      </div>

      {/* DETALLE */}
      <div className="xl:sticky xl:top-6">
        {seleccionada ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3 bg-brand-green px-5 py-4">
              <Avatar nombre={nombresAlumnos[seleccionada.alumnoId] ?? "Alumno"} onDark />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-white">
                  {nombresAlumnos[seleccionada.alumnoId] ?? "Alumno"}
                </p>
                <p className="truncate text-xs font-medium text-white/80">
                  {formatearFecha(seleccionada.fecha)}
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

            <div className="grid grid-cols-3 gap-3 p-5">
              <NotaCampo label="Técnico" nota={seleccionada.rendimientoTecnico} />
              <NotaCampo label="Físico" nota={seleccionada.rendimientoFisico} />
              <NotaCampo label="Actitud" nota={seleccionada.actitud} />
            </div>

            <div className="px-5 pb-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Observaciones
              </p>
              <p className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {seleccionada.observaciones}
              </p>
            </div>

            <div className="space-y-2 px-5 pb-5">
              <button
                type="button"
                onClick={() => onEditar(seleccionada)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
              >
                <EditIcon />
                Editar evaluación
              </button>
              <button
                type="button"
                onClick={() => onEliminar(seleccionada)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <TrashIcon />
                Eliminar evaluación
              </button>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <ClipboardIcon />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Selecciona una evaluación
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Toca cualquier tarjeta de la lista para ver su detalle aquí.
            </p>
          </div>
        )}
      </div>
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

function NotaBadge({ nota }: { nota: number }) {
  const tono =
    nota >= 7
      ? "bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"
      : nota >= 5
        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${tono}`}>
      {nota.toFixed(1)}
    </span>
  );
}

function NotaCampo({ label, nota }: { label: string; nota?: number }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-navy dark:text-white">
        {typeof nota === "number" ? nota : "—"}
      </p>
    </div>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fecha}T12:00:00`));
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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 .8 12.1A2 2 0 0 0 7.8 21h8.4a2 2 0 0 0 2-1.9L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
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