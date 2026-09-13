"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Sede } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { RoleGuard } from "@/components/shared/role-guard";
import SedeForm from "@/components/forms/sede-form";
import SedesTabla from "@/components/shared/sedes-tabla";
import {
  obtenerSedes,
  obtenerSedesIniciales,
  suscribirSedes,
  crearSede,
  actualizarSede,
  eliminarSede,
} from "@/store/sedes-store";

export default function SedesPage() {
  const sedes = useSyncExternalStore(suscribirSedes, obtenerSedes, obtenerSedesIniciales);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [sedeAEditar, setSedeAEditar] = useState<Sede | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleAbrirFormularioNuevo = () => {
    setSedeAEditar(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setSedeAEditar(null);
  };

  const handleGuardarSede = (data: Omit<Sede, "id">, id?: string) => {
    if (id) {
      actualizarSede(id, data);
      setMensajeExito(`Sede "${data.nombre}" actualizada correctamente`);
    } else {
      crearSede(data);
      setMensajeExito(`Sede "${data.nombre}" creada correctamente`);
    }
    setMostrarFormulario(false);
    setSedeAEditar(null);
  };

  const handleEditarSede = (sede: Sede) => {
    setSedeAEditar(sede);
    setMostrarFormulario(true);
  };

  const handleEliminarSede = async (sede: Sede) => {
    const confirmado = await confirm({
      title: "Eliminar sede",
      message: (
        <>
          ¿Está seguro de que desea eliminar la sede <strong>{sede.nombre}</strong>? Esta
          acción no se puede deshacer.
        </>
      ),
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    eliminarSede(sede.id);
    setMensajeExito(`Sede "${sede.nombre}" eliminada correctamente`);
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">
              ADMINISTRACIÓN
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Sedes
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Administra los locales del club. Podrás agregar nuevas sedes cuando la
              operación crezca, sin depender de un desarrollador.
            </p>
          </div>
          <button
            onClick={handleAbrirFormularioNuevo}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon />
            Nueva sede
          </button>
        </div>

        {mensajeExito && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
            <p className="font-medium">{mensajeExito}</p>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <SedesTabla
            sedes={sedes}
            puedeGestionar
            onEditar={handleEditarSede}
            onEliminar={handleEliminarSede}
          />
        </div>
      </div>

      {mostrarFormulario && (
        <SedeForm
          sedeAEditar={sedeAEditar}
          onClose={handleCerrarFormulario}
          onGuardar={handleGuardarSede}
        />
      )}

      {dialog}
    </RoleGuard>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
