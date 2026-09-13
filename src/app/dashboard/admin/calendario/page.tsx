"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useConfirm } from "@/hooks/use-confirm";
import EventoForm from "@/components/forms/evento-form";
import {
  obtenerEventos,
  obtenerEventosIniciales,
  suscribirEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  obtenerProximasActividadesTodas,
} from "@/store/calendario-store";
import {
  obtenerCategorias,
  obtenerCategoriasIniciales,
  suscribirCategorias,
} from "@/store/categorias-store";
import type { EventoClub } from "@/types/calendario";

export default function CalendarioAdminPage() {
  const eventos = useSyncExternalStore(suscribirEventos, obtenerEventos, obtenerEventosIniciales);
  const categorias = useSyncExternalStore(
    suscribirCategorias,
    obtenerCategorias,
    obtenerCategoriasIniciales,
  );

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState<EventoClub | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

  const proximasActividades = useMemo(
    () => {
      void eventos;
      void categorias;
      return obtenerProximasActividadesTodas(new Date(), 20);
    },
    [eventos, categorias],
  );

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleNuevo = () => {
    setEventoAEditar(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (evento: EventoClub) => {
    setEventoAEditar(evento);
    setMostrarFormulario(true);
  };

  const handleGuardar = (data: Omit<EventoClub, "id">, id?: string) => {
    if (id) {
      actualizarEvento(id, data);
      setMensajeExito(`Evento "${data.titulo}" actualizado correctamente`);
    } else {
      crearEvento(data);
      setMensajeExito(`Evento "${data.titulo}" programado correctamente`);
    }
    setMostrarFormulario(false);
    setEventoAEditar(null);
  };

  const handleEliminar = async (evento: EventoClub) => {
    const confirmado = await confirm({
      title: "Eliminar evento",
      message: (
        <>
          ¿Seguro que deseas eliminar <strong>{evento.titulo}</strong>?
        </>
      ),
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    eliminarEvento(evento.id);
    setMensajeExito(`Evento "${evento.titulo}" eliminado correctamente`);
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">ADMINISTRACIÓN</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Calendario
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Programa entrenamientos especiales, torneos y eventos del club.
          </p>
        </header>

        {mensajeExito && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
            <p className="font-medium">{mensajeExito}</p>
          </div>
        )}

        <div className="mb-6 flex justify-end">
          <button
            onClick={handleNuevo}
            className="whitespace-nowrap rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            + Programar evento
          </button>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-950 dark:text-white">
              Próximas actividades (todas las categorías)
            </h2>
            <div className="space-y-3">
              {proximasActividades.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-9 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  No hay actividades programadas en las próximas semanas.
                </div>
              ) : (
                proximasActividades.map((actividad) => (
                  <article
                    key={actividad.id}
                    className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[5rem_1fr] sm:items-center dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(
                        new Date(`${actividad.fecha}T12:00:00`),
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold capitalize ${
                            actividad.tipo === "entrenamiento"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
                          }`}
                        >
                          {actividad.tipo}
                        </span>
                        <p className="font-bold text-slate-950 dark:text-white">{actividad.titulo}</p>
                        {actividad.categoria && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            · {actividad.categoria}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {actividad.ubicacion} · {actividad.horaInicio}
                        {actividad.horaFin ? ` – ${actividad.horaFin}` : ""}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-950 dark:text-white">
              Eventos programados
            </h2>
            <div className="space-y-3">
              {eventos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  No hay eventos creados todavía.
                </div>
              ) : (
                eventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="font-bold text-slate-950 dark:text-white">{evento.titulo}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {evento.fecha} · {evento.horaInicio}
                      {evento.horaFin ? `–${evento.horaFin}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{evento.ubicacion}</p>
                    <div className="mt-3 flex gap-3 text-xs font-semibold">
                      <button
                        onClick={() => handleEditar(evento)}
                        className="text-primary-dark hover:text-primary-hover dark:text-emerald-400"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(evento)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {mostrarFormulario && (
          <EventoForm
            key={eventoAEditar?.id ?? "nuevo"}
            eventoAEditar={eventoAEditar}
            categorias={categorias}
            onClose={() => setMostrarFormulario(false)}
            onGuardar={handleGuardar}
          />
        )}

        {dialog}
      </div>
    </RoleGuard>
  );
}
