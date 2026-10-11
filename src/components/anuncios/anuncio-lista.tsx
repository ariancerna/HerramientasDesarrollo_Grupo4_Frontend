"use client";

import { useMemo, useState } from "react";
import type { Anuncio } from "@/types/anuncio";

interface AnuncioListaProps {
  anuncios: Anuncio[];
  nombresDestinatarios: (anuncio: Anuncio) => string[];
  nombreCategoria: (anuncio: Anuncio) => string | undefined;
  onEditar: (anuncio: Anuncio) => void;
  onEliminar: (anuncio: Anuncio) => void;
}

export function AnuncioLista({
  anuncios,
  nombresDestinatarios,
  nombreCategoria,
  onEditar,
  onEliminar,
}: AnuncioListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<"todos" | "borrador" | "enviado">("todos");
  const [fecha, setFecha] = useState("");

  const filtrados = useMemo(() => {
    const termino = texto.trim().toLowerCase();
    return anuncios.filter((anuncio) => {
      const coincideTexto =
        !termino ||
        anuncio.titulo.toLowerCase().includes(termino) ||
        anuncio.mensaje.toLowerCase().includes(termino);
      const coincideEstado = estado === "todos" || anuncio.estado === estado;
      const coincideFecha = !fecha || anuncio.fechaCreacion.slice(0, 10) === fecha;
      return coincideTexto && coincideEstado && coincideFecha;
    });
  }, [anuncios, texto, estado, fecha]);

  const seleccionado = filtrados.find((a) => a.id === seleccionadoId) ?? null;

  return (
    <div>
      {/* FILTROS */}
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex-row">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por título o mensaje..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:flex-1"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-48"
        >
          <option value="todos">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="enviado">Enviado</option>
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-48"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        {/* LISTA */}
        <div className="space-y-2.5">
          {filtrados.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No se encontraron anuncios con esos filtros.
            </div>
          )}

          {filtrados.map((anuncio) => {
            const activo = seleccionadoId === anuncio.id;
            const categoria = nombreCategoria(anuncio);
            return (
              <button
                key={anuncio.id}
                type="button"
                onClick={() => setSeleccionadoId(anuncio.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                  activo
                    ? "border-brand-green ring-2 ring-brand-green/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
                  <MegaphoneIcon />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                    {anuncio.titulo}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {categoria ?? `${anuncio.destinatarios.length} destinatario(s)`} ·{" "}
                    {formatearFecha(anuncio.fechaCreacion)}
                  </p>
                </div>

                <EstadoBadge estado={anuncio.estado} />
              </button>
            );
          })}
        </div>

        {/* DETALLE */}
        <div className="xl:sticky xl:top-6">
          {seleccionado ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3 bg-brand-green px-5 py-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 text-white">
                  <MegaphoneIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-white">{seleccionado.titulo}</p>
                  <p className="truncate text-xs font-medium text-white/80">
                    {formatearFecha(seleccionado.fechaCreacion)}
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

              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Mensaje</p>
                <p className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {seleccionado.mensaje}
                </p>

                <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Destinatarios
                </p>
                {nombreCategoria(seleccionado) ? (
                  <p className="mt-1.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                    Toda la categoría {nombreCategoria(seleccionado)}
                  </p>
                ) : (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {nombresDestinatarios(seleccionado).map((nombre) => (
                      <span
                        key={nombre}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {nombre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 px-5 pb-5">
                <button
                  type="button"
                  onClick={() => onEditar(seleccionado)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
                >
                  <EditIcon />
                  Editar anuncio
                </button>
                <button
                  type="button"
                  onClick={() => onEliminar(seleccionado)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <TrashIcon />
                  Eliminar anuncio
                </button>
              </div>
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <MegaphoneIconOutline />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Selecciona un anuncio
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

function EstadoBadge({ estado }: { estado: "borrador" | "enviado" }) {
  const enviado = estado === "enviado";
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${
        enviado
          ? "bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"
          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {enviado ? "Enviado" : "Borrador"}
    </span>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(fecha));
}

/* ICONOS */

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 10v4a1 1 0 0 0 1 1h2l1 5h2l-1-5h3l7 4V6l-7 4H6a1 1 0 0 0-1 1 1 1 0 0 0-1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M19 9.5a3 3 0 0 1 0 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MegaphoneIconOutline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M3 10v4a1 1 0 0 0 1 1h2l1 5h2l-1-5h3l7 4V6l-7 4H6a1 1 0 0 0-1 1 1 1 0 0 0-1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M19 9.5a3 3 0 0 1 0 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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