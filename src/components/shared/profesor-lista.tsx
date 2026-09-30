"use client";

import { useState } from "react";
import type { Categoria, Profesor } from "@/types";

interface ProfesorListaProps {
  profesores: Profesor[];
  categorias: Categoria[];
  onEditar: (profesor: Profesor) => void;
  onEliminar: (profesor: Profesor) => void;
}

export function ProfesorLista({ profesores, categorias, onEditar, onEliminar }: ProfesorListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const seleccionado = profesores.find((p) => p.id === seleccionadoId) ?? null;

  const categoriasDe = (profesorId: string) =>
    categorias.filter((categoria) => categoria.profesorIds?.includes(profesorId));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      {/* LISTA */}
      <div className="space-y-2.5">
        {profesores.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No se encontraron profesores.
          </div>
        )}

        {profesores.map((profesor) => {
          const activo = seleccionadoId === profesor.id;
          const misCategorias = categoriasDe(profesor.id);
          return (
            <button
              key={profesor.id}
              type="button"
              onClick={() => setSeleccionadoId(profesor.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                activo
                  ? "border-brand-green ring-2 ring-brand-green/20"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
              }`}
            >
              <Avatar nombre={profesor.nombre} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                  {profesor.nombre}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">@{profesor.usuario}</p>
              </div>

              <span className="shrink-0 rounded-full bg-brand-green-soft px-2.5 py-1 text-xs font-extrabold text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
                {misCategorias.length} categoría{misCategorias.length === 1 ? "" : "s"}
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
              <Avatar nombre={seleccionado.nombre} onDark />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-white">{seleccionado.nombre}</p>
                <p className="truncate text-xs font-medium text-white/80">@{seleccionado.usuario}</p>
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
                Categorías asignadas
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {categoriasDe(seleccionado.id).length > 0 ? (
                  categoriasDe(seleccionado.id).map((categoria) => (
                    <span
                      key={categoria.id}
                      className="rounded-full bg-brand-green-soft px-2.5 py-1 text-xs font-bold text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"
                    >
                      {categoria.nombre}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">Sin categorías asignadas</span>
                )}
              </div>
            </div>

            <div className="space-y-2 px-5 pb-5">
              <button
                type="button"
                onClick={() => onEditar(seleccionado)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
              >
                <EditIcon />
                Editar información
              </button>
              <button
                type="button"
                onClick={() => onEliminar(seleccionado)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <TrashIcon />
                Eliminar profesor
              </button>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <UserIcon />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Selecciona un profesor
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

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}