"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerProximasActividades } from "@/store/calendario-store";
import type {
  ActividadCalendario,
  TipoActividad,
} from "@/types/calendario";

type FiltroActividad = TipoActividad | "todos";

const FILTROS: Array<{ valor: FiltroActividad; etiqueta: string }> = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "entrenamiento", etiqueta: "Entrenamientos" },
  { valor: "evento", etiqueta: "Eventos" },
];

export default function CalendarioAlumnoPage() {
  const [filtro, setFiltro] = useState<FiltroActividad>("todos");
  const { session } = useAuth();
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId
    ? obtenerAlumnos().find((item) => item.id === estudianteId)
    : undefined;
  const actividades = alumno
    ? obtenerProximasActividades(alumno.categoria)
    : [];
  const actividadesFiltradas = actividades.filter(
    (actividad) => filtro === "todos" || actividad.tipo === filtro,
  );
  const siguienteActividad = actividades[0];
  const totalEntrenamientos = actividades.filter(
    (actividad) => actividad.tipo === "entrenamiento",
  ).length;
  const totalEventos = actividades.filter(
    (actividad) => actividad.tipo === "evento",
  ).length;

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <header className="mb-6">
          <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">
            MI ESPACIO
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Calendario
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Revisa tus próximos entrenamientos y eventos del club.
          </p>
        </header>

        {!estudianteId ? (
          <MensajeVacio texto="No se pudo identificar al alumno asociado a esta sesión." />
        ) : !alumno ? (
          <MensajeVacio texto="No encontramos la categoría asignada a este alumno." />
        ) : (
          <>
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.7fr)]">
              <div className="relative overflow-hidden rounded-2xl bg-[#0A1628] p-6 text-white shadow-sm sm:p-8">
                <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border-[32px] border-[#6FCF3A]/10" aria-hidden="true" />
                <p className="relative text-xs font-bold uppercase tracking-[0.14em] text-[#9adf76]">
                  Próxima actividad
                </p>
                {siguienteActividad ? (
                  <div className="relative mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <TipoBadge tipo={siguienteActividad.tipo} oscuro />
                        <span className="text-sm text-slate-300">
                          {alumno.categoria}
                        </span>
                      </div>
                      <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                        {siguienteActividad.titulo}
                      </h2>
                      <p className="mt-2 text-sm text-slate-300">
                        {siguienteActividad.ubicacion}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 sm:text-right">
                      <p className="text-sm font-bold text-white first-letter:uppercase">
                        {formatearFechaLarga(siguienteActividad.fecha)}
                      </p>
                      <p className="mt-1 text-sm text-[#9adf76]">
                        {formatearHorario(siguienteActividad)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="relative mt-4 text-sm text-slate-300">
                    No hay actividades programadas próximamente.
                  </p>
                )}
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Próximas 5 semanas
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <ResumenAgenda
                    etiqueta="Entrenamientos"
                    valor={totalEntrenamientos}
                    color="verde"
                  />
                  <ResumenAgenda
                    etiqueta="Eventos"
                    valor={totalEventos}
                    color="azul"
                  />
                </div>
                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Categoría</p>
                  <p className="mt-1 font-bold text-slate-950 dark:text-white">
                    {alumno.categoria}
                  </p>
                </div>
              </aside>
            </section>

            <section className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Próximas actividades
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Agenda ordenada por fecha y hora.
                  </p>
                </div>
                <div className="flex w-full gap-1 rounded-xl bg-slate-100 p-1 sm:w-auto dark:bg-slate-800" aria-label="Filtrar actividades">
                  {FILTROS.map((item) => (
                    <button
                      key={item.valor}
                      type="button"
                      onClick={() => setFiltro(item.valor)}
                      aria-pressed={filtro === item.valor}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition sm:flex-none ${
                        filtro === item.valor
                          ? "bg-white text-primary-dark shadow-sm dark:bg-slate-700 dark:text-emerald-300"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {item.etiqueta}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3" aria-live="polite">
                {actividadesFiltradas.length > 0 ? (
                  actividadesFiltradas.map((actividad) => (
                    <ActividadCard key={actividad.id} actividad={actividad} />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-9 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    No hay actividades de este tipo en las próximas semanas.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </RoleGuard>
  );
}

function ActividadCard({ actividad }: { actividad: ActividadCalendario }) {
  const fecha = new Date(`${actividad.fecha}T12:00:00`);
  const dia = new Intl.DateTimeFormat("es-PE", { day: "2-digit" }).format(fecha);
  const mes = new Intl.DateTimeFormat("es-PE", { month: "short" })
    .format(fecha)
    .replace(".", "");

  return (
    <article className="group grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#86c966] hover:shadow-md sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center sm:p-5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500/60">
      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-slate-100 text-center dark:bg-slate-800">
        <span className="text-xl font-extrabold leading-none text-slate-950 dark:text-white">{dia}</span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{mes}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-950 dark:text-white">{actividad.titulo}</h3>
          <TipoBadge tipo={actividad.tipo} />
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {actividad.descripcion}
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <PinIcon /> {actividad.ubicacion}
        </p>
      </div>
      <div className="border-t border-slate-100 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 dark:border-slate-800">
        <p className="text-xs text-slate-400">Horario</p>
        <p className="mt-1 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
          {formatearHorario(actividad)}
        </p>
        <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
          {new Intl.DateTimeFormat("es-PE", { weekday: "long" }).format(fecha)}
        </p>
      </div>
    </article>
  );
}

function TipoBadge({ tipo, oscuro = false }: { tipo: TipoActividad; oscuro?: boolean }) {
  const clase = oscuro
    ? tipo === "entrenamiento"
      ? "bg-[#6FCF3A]/15 text-[#a8e887] ring-[#6FCF3A]/30"
      : "bg-sky-400/15 text-sky-200 ring-sky-300/30"
    : tipo === "entrenamiento"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300"
      : "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/15 dark:text-sky-300";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${clase}`}>
      {tipo}
    </span>
  );
}

function ResumenAgenda({ etiqueta, valor, color }: { etiqueta: string; valor: number; color: "verde" | "azul" }) {
  return (
    <div className={`rounded-xl p-4 ${color === "verde" ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-sky-50 dark:bg-sky-500/10"}`}>
      <p className={`text-2xl font-extrabold ${color === "verde" ? "text-emerald-700 dark:text-emerald-300" : "text-sky-700 dark:text-sky-300"}`}>{valor}</p>
      <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">{etiqueta}</p>
    </div>
  );
}

function MensajeVacio({ texto }: { texto: string }) {
  return (
    <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
      {texto}
    </div>
  );
}

function formatearFechaLarga(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${fecha}T12:00:00`));
}

function formatearHorario(actividad: ActividadCalendario) {
  return actividad.horaFin
    ? `${actividad.horaInicio} – ${actividad.horaFin}`
    : actividad.horaInicio;
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M10 18s5.5-4.8 5.5-9.2a5.5 5.5 0 1 0-11 0C4.5 13.2 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
