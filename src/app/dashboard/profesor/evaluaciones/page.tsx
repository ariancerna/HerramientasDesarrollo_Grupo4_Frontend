"use client";

import { avisar } from "@/components/ui/toaster";
import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import EvaluacionForm from "@/components/evaluaciones/evaluacion-form";
import { EvaluacionLista } from "@/components/evaluaciones/evaluacion-lista";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useAlumnos } from "@/store/alumnos-store";
import {
  actualizarEvaluacion,
  crearEvaluacion,
  eliminarEvaluacion,
  useEvaluaciones,
} from "@/store/evaluaciones-store";
import { ErrorBanner } from "@/components/shared/error-banner";
import { mensajeError } from "@/lib/api";
import { Evaluacion, EvaluacionFormData } from "@/types/evaluacion";

export default function EvaluacionesProfesorPage() {
  const { session } = useAuth();
  const { confirm, dialog } = useConfirm();
  const profesorId = session?.usuario.id ?? "";
  const alumnos = useAlumnos();
  const todasLasEvaluaciones = useEvaluaciones();
  const evaluaciones = useMemo(
    () => todasLasEvaluaciones.filter((evaluacion) => evaluacion.profesorId === profesorId),
    [todasLasEvaluaciones, profesorId],
  );
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [evaluacionAEditar, setEvaluacionAEditar] = useState<Evaluacion | null>(null);

  const nombresAlumnos = useMemo(
    () =>
      Object.fromEntries(
        alumnos.map((alumno) => [alumno.id, `${alumno.nombres} ${alumno.apellidos}`]),
      ),
    [alumnos],
  );

  const abrirNuevaEvaluacion = () => {
    setEvaluacionAEditar(null);
    setMostrarFormulario(true);
  };

  const abrirEdicion = (evaluacion: Evaluacion) => {
    setEvaluacionAEditar(evaluacion);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEvaluacionAEditar(null);
  };

  const guardar = async (data: EvaluacionFormData, id?: string) => {
    setError(null);
    try {
      if (id) {
        await actualizarEvaluacion(id, data);
        avisar("Evaluación actualizada.");
      } else {
        await crearEvaluacion(data);
        avisar("Evaluación registrada.");
      }
      cerrarFormulario();
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar la evaluación."));
    }
  };

  const eliminar = async (evaluacion: Evaluacion) => {
    const confirmado = await confirm({
      title: "Eliminar evaluación",
      message: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    setError(null);
    try {
      await eliminarEvaluacion(evaluacion.id);
      avisar("Evaluación eliminada.");
    } catch (err) {
      setError(mensajeError(err, "No se pudo eliminar la evaluación."));
    }
  };

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Evaluaciones
          </h1>
          <button
            type="button"
            onClick={abrirNuevaEvaluacion}
            disabled={alumnos.length === 0}
            className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Registrar evaluación
          </button>
        </header>

        <div className="mb-5">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
        </div>

        <EvaluacionLista
          evaluaciones={evaluaciones}
          nombresAlumnos={nombresAlumnos}
          onEditar={abrirEdicion}
          onEliminar={eliminar}
        />

        {mostrarFormulario && (
          <EvaluacionForm
            key={evaluacionAEditar?.id ?? "nueva"}
            alumnos={alumnos}
            evaluacionAEditar={evaluacionAEditar}
            onClose={cerrarFormulario}
            onGuardar={guardar}
          />
        )}
        {dialog}
      </div>
    </RoleGuard>
  );
}