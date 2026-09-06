"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Profesor } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { RoleGuard } from "@/components/shared/role-guard";
import ProfesorForm from "@/components/forms/profesor-form";
import ProfesoresTabla from "@/components/shared/profesores-tabla";
import {
  obtenerProfesores,
  obtenerProfesoresIniciales,
  suscribirProfesores,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
  filtrarProfesores,
} from "@/store/profesores-store";
import { obtenerSedes, obtenerSedesIniciales, suscribirSedes } from "@/store/sedes-store";

export default function ProfesoresPage() {
  const profesores = useSyncExternalStore(
    suscribirProfesores,
    obtenerProfesores,
    obtenerProfesoresIniciales,
  );
  const sedes = useSyncExternalStore(suscribirSedes, obtenerSedes, obtenerSedesIniciales);
  const [texto, setTexto] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [profesorAEditar, setProfesorAEditar] = useState<Profesor | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

  const profesoresFiltrados = useMemo(
    () => filtrarProfesores(profesores, texto),
    [profesores, texto],
  );

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleNuevo = () => {
    setProfesorAEditar(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (profesor: Profesor) => {
    setProfesorAEditar(profesor);
    setMostrarFormulario(true);
  };

  const handleGuardar = (data: Omit<Profesor, "id">, id?: string) => {
    if (id) {
      actualizarProfesor(id, data);
      setMensajeExito(`Profesor "${data.nombre}" actualizado correctamente`);
    } else {
      crearProfesor(data);
      setMensajeExito(`Profesor "${data.nombre}" creado correctamente`);
    }
    setMostrarFormulario(false);
    setProfesorAEditar(null);
  };

  const handleEliminar = async (profesor: Profesor) => {
    const confirmado = await confirm({
      title: "Eliminar profesor",
      message: (
        <>
          ¿Seguro que deseas eliminar a <strong>{profesor.nombre}</strong>? Perderá el
          acceso al sistema y esta acción no se puede deshacer.
        </>
      ),
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    eliminarProfesor(profesor.id);
    setMensajeExito(`Profesor "${profesor.nombre}" eliminado correctamente`);
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">
            ADMINISTRACIÓN
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Profesores
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Da de alta profesores, asígnalos a una sede y gestiona su acceso al sistema.
          </p>
        </header>

        {mensajeExito && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
            <p className="font-medium">{mensajeExito}</p>
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre o usuario..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-80"
          />
          <button
            onClick={handleNuevo}
            className="whitespace-nowrap rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12613D] focus:outline-none focus:ring-2 focus:ring-[#16794C] focus:ring-offset-2"
          >
            + Nuevo profesor
          </button>
        </div>

        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          {profesoresFiltrados.length} profesor(es) encontrado(s)
        </p>

        <ProfesoresTabla
          profesores={profesoresFiltrados}
          sedes={sedes}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />

        {mostrarFormulario && (
          <ProfesorForm
            key={profesorAEditar?.id ?? "nuevo"}
            profesorAEditar={profesorAEditar}
            sedes={sedes}
            onClose={() => setMostrarFormulario(false)}
            onGuardar={handleGuardar}
          />
        )}

        {dialog}
      </div>
    </RoleGuard>
  );
}
