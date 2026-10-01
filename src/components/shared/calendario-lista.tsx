"use client";

import { useMemo, useState } from "react";
import type { ActividadCalendario, EventoClub } from "@/types/calendario";
import type { Categoria } from "@/types";

interface CalendarioListaProps {
  actividades: ActividadCalendario[];
  eventos: EventoClub[];
  categorias: Categoria[];
  onEditar: (evento: EventoClub) => void;
  onEliminar: (evento: EventoClub) => void;
}

type Tab = "todas" | "entrenamiento" | "evento";

export function CalendarioLista({
  actividades,
  eventos,
  categorias,
  onEditar,
  onEliminar,
}: CalendarioListaProps) {
  const [tab, setTab] = useState<Tab>("todas");
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [fecha, setFecha] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    const termino = texto.trim().toLowerCase();
    return actividades.filter((actividad) => {
      const coincideTab = tab === "todas" || actividad.tipo === tab;
      const coincideTexto =
        !termino ||
        actividad.titulo.toLowerCase().includes(termino) ||
        actividad.ubicacion.toLowerCase().includes(termino);
      const coincideCategoria = categoria === "todas" || actividad.categoria === categoria;
      const coincideFecha = !fecha || actividad.fecha === fecha;
      return coincideTab && coincideTexto && coincideCategoria && coincideFecha;
    });
  }, [actividades, tab, texto, categoria, fecha]);

  const seleccionada = filtradas.find((a) => a.id === seleccionadoId) ?? null;
  const eventoSeleccionado = seleccionada
    ? eventos.find((e) => e.id === seleccionada.id) ?? null
    : null;

  return (
    <div>
      {/* TABS */}
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        <TabButton active={tab === "todas"} onClick={() => setTab("todas")}>
          Todas
        </TabButton>
        <TabButton active={tab === "entrenamiento"} onClick={() => setTab("entrenamiento")}>
          Próximas actividades
        </TabButton>
        <TabButton active={tab === "evento"} onClick={() => setTab("evento")}>
          Eventos programados
        </TabButton>
      </div>

      {/* FILTROS */}
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:flex-row">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por título o ubicación..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white md:flex-1"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white md:w-56"
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white md:w-48"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        {/* LISTA */}
        <div className="max-h-[70vh] space-y-2.5 overflow-y-auto pr-1">
          {filtradas.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No se encontraron actividades con esos filtros.
            </div>
          )}

          {filtradas.map((actividad) => {
            const activo = seleccionadoId === actividad.id;
            return (
              <button
                key={actividad.id}
                type="button"
                onClick={() => setSeleccionadoId(actividad.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition dark:bg-slate-900 ${
                  activo
                    ? "border-brand-green ring-2 ring-brand-green/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                }`}
              >
                <DateBadge fecha={actividad.fecha} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <TipoBadge tipo={actividad.tipo} />
                    <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
                      {actividad.titulo}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {actividad.ubicacion} · {actividad.horaInicio}
                    {actividad.horaFin ? ` – ${actividad.horaFin}` : ""}
                    {actividad.categoria ? ` · ${actividad.categoria}` : ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* DETALLE */}
        <div className="xl:sticky xl:top-6">
          {seleccionada ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3 bg-brand-green px-5 py-4">
                <DateBadge fecha={seleccionada.fecha} onDark />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-white">{seleccionada.titulo}</p>
                  <p className="truncate text-xs font-medium text-white/80 capitalize">
                    {seleccionada.tipo}
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
                <DetalleCampo label="Ubicación" value={seleccionada.ubicacion} full />
                <DetalleCampo
                  label="Horario"
                  value={`${seleccionada.horaInicio}${seleccionada.horaFin ? ` – ${seleccionada.horaFin}` : ""}`}
                />
                <DetalleCampo label="Categoría" value={seleccionada.categoria ?? "Todas"} />
                {seleccionada.descripcion && (
                  <DetalleCampo label="Descripción" value={seleccionada.descripcion} full />
                )}
              </div>

              <div className="space-y-2 px-5 pb-5">
                {eventoSeleccionado ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onEditar(eventoSeleccionado)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
                    >
                      <EditIcon />
                      Editar evento
                    </button>
                    <button
                      type="button"
                      onClick={() => onEliminar(eventoSeleccionado)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <TrashIcon />
                      Eliminar evento
                    </button>
                  </>
                ) : (
                  <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Este entrenamiento proviene del horario fijo de la categoría. Para cambiarlo,
                    edítalo desde <strong>Categorías</strong>.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <CalendarIcon />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Selecciona una actividad
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

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-brand-green text-brand-green dark:border-brand-lime-light dark:text-brand-lime-light"
          : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function DateBadge({ fecha, onDark }: { fecha: string; onDark?: boolean }) {
  const d = new Date(`${fecha}T12:00:00`);
  return (
    <div
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-center ${
        onDark ? "bg-white/20" : "bg-brand-green-soft dark:bg-brand-green/15"
      }`}
    >
      <div>
        <span
          className={`block text-base font-black leading-none ${
            onDark ? "text-white" : "text-brand-green dark:text-brand-lime-light"
          }`}
        >
          {d.getDate()}
        </span>
        <span
          className={`mt-0.5 block text-[9px] font-bold uppercase ${
            onDark ? "text-white/80" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {new Intl.DateTimeFormat("es-PE", { month: "short" }).format(d).replace(".", "")}
        </span>
      </div>
    </div>
  );
}

function TipoBadge({ tipo }: { tipo: "entrenamiento" | "evento" }) {
  const esEntrenamiento = tipo === "entrenamiento";
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold capitalize ${
        esEntrenamiento
          ? "bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"
          : "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
      }`}
    >
      {tipo}
    </span>
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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}