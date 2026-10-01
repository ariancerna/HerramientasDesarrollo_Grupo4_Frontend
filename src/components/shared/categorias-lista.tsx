"use client";

import { useMemo, useState } from "react";
import type { Categoria } from "@/types";

interface CategoriasListaProps {
  categorias: Categoria[];
  onEditar: (categoria: Categoria) => void;
  onEliminar: (categoria: Categoria) => void;
}

const DIA_CORTO: Record<string, string> = {
  lunes: "Lun",
  martes: "Mar",
  "miércoles": "Mié",
  jueves: "Jue",
  viernes: "Vie",
  "sábado": "Sáb",
  domingo: "Dom",
};

const DIAS: { value: string; label: string }[] = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miércoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sábado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

export function CategoriasLista({ categorias, onEditar, onEliminar }: CategoriasListaProps) {
  const [texto, setTexto] = useState("");
  const [dia, setDia] = useState("todos");
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    const termino = texto.trim().toLowerCase();
    return categorias.filter((c) => {
      const coincideTexto =
        !termino ||
        c.nombre.toLowerCase().includes(termino) ||
        (c.descripcion ?? "").toLowerCase().includes(termino);
      const coincideDia = dia === "todos" || c.horarios.some((h) => h.dia === dia);
      return coincideTexto && coincideDia;
    });
  }, [categorias, texto, dia]);

  const seleccionada = filtradas.find((c) => c.id === seleccionadoId) ?? null;

  return (
    <div>
      {/* FILTROS */}
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por nombre o descripción..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:flex-1"
        />
        <select
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:w-52"
        >
          <option value="todos">Todos los días</option>
          {DIAS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        {/* LISTA */}
        <div className="space-y-2.5">
          {filtradas.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No se encontraron categorías.
            </div>
          )}

          {filtradas.map((categoria) => {
            const activo = seleccionadoId === categoria.id;
            return (
              <button
                key={categoria.id}
                type="button"
                onClick={() => setSeleccionadoId(categoria.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                  activo
                    ? "border-brand-green ring-2 ring-brand-green/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-green-soft text-sm font-extrabold text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
                  <TagIcon />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                    {categoria.nombre}
                  </p>
                  {categoria.descripcion && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">{categoria.descripcion}</p>
                  )}
                </div>

                <span className="shrink-0 rounded-full bg-brand-green-soft px-2.5 py-1 text-xs font-extrabold text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
                  {categoria.horarios.length} horario{categoria.horarios.length === 1 ? "" : "s"}
                </span>
              </button>
            );
          })}
        </div>

        {/* DETALLE */}
        <div className="xl:sticky xl:top-6">
          {seleccionada ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3 bg-brand-green px-5 py-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 text-white">
                  <TagIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-white">{seleccionada.nombre}</p>
                  {seleccionada.descripcion && (
                    <p className="truncate text-xs font-medium text-white/80">{seleccionada.descripcion}</p>
                  )}
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

              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Horarios de entrenamiento
                </p>
                {seleccionada.horarios.length > 0 ? (
                  <div className="mt-2 space-y-1.5">
                    {seleccionada.horarios.map((horario) => (
                      <div
                        key={horario.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {DIA_CORTO[horario.dia] ?? horario.dia}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {horario.horaInicio}–{horario.horaFin}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">Sin horarios asignados</p>
                )}
              </div>

              <div className="space-y-2 px-5 pb-5">
                <button
                  type="button"
                  onClick={() => onEditar(seleccionada)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
                >
                  <EditIcon />
                  Editar categoría
                </button>
                <button
                  type="button"
                  onClick={() => onEliminar(seleccionada)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <TrashIcon />
                  Eliminar categoría
                </button>
              </div>
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <TagIconOutline />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Selecciona una categoría
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

/* ICONOS */

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M11 3h6a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0l-5-5a2 2 0 0 1 0-2.8l8-8A2 2 0 0 1 11 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function TagIconOutline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M11 3h6a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0l-5-5a2 2 0 0 1 0-2.8l8-8A2 2 0 0 1 11 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

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