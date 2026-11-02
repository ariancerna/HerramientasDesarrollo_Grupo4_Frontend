"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useConfirm } from "@/hooks/use-confirm";
import EventoForm from "@/components/forms/evento-form";
import { CalendarioLista } from "@/components/shared/calendario-lista";
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
import { ErrorBanner } from "@/components/shared/error-banner";
import { mensajeError } from "@/lib/api";

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
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

  const proximasActividades = useMemo(
    () => {
      void eventos;
      void categorias;
      return obtenerProximasActividadesTodas(new Date(), 150);
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

  const handleGuardar = async (data: Omit<EventoClub, "id">, id?: string) => {
    setError(null);
    try {
      if (id) {
        await actualizarEvento(id, data);
        setMensajeExito(`Evento "${data.titulo}" actualizado correctamente`);
      } else {
        await crearEvento(data);
        setMensajeExito(`Evento "${data.titulo}" programado correctamente`);
      }
      setMostrarFormulario(false);
      setEventoAEditar(null);
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar el evento."));
    }
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

    setError(null);
    try {
      await eliminarEvento(evento.id);
      setMensajeExito(`Evento "${evento.titulo}" eliminado correctamente`);
    } catch (err) {
      setError(mensajeError(err, "No se pudo eliminar el evento."));
    }
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Calendario
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Programa entrenamientos especiales, torneos y eventos del club.
          </p>
        </header>

        <div className="mb-5">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
        </div>

        {mensajeExito && (
          <div className="mb-5 rounded-lg border border-brand-green/20 bg-brand-green-soft p-4 text-sm text-brand-green shadow-sm dark:border-brand-green/30 dark:bg-brand-green/10 dark:text-brand-lime-light">
            <p className="font-medium">{mensajeExito}</p>
          </div>
        )}

        <div className="mb-6 flex justify-end">
          <button
            onClick={handleNuevo}
            className="whitespace-nowrap rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          >
            + Programar evento
          </button>
        </div>

        <CalendarioLista
          actividades={proximasActividades}
          eventos={eventos}
          categorias={categorias}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />

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