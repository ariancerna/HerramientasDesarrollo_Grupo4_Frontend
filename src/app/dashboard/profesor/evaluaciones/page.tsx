"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import EvaluacionForm from "@/components/evaluaciones/evaluacion-form";
import EvaluacionTabla from "@/components/evaluaciones/evaluacion-tabla";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { obtenerAlumnos } from "@/store/alumnos-store";
import {
  actualizarEvaluacion,
  crearEvaluacion,
  eliminarEvaluacion,
  obtenerEvaluacionesPorProfesor,
} from "@/store/evaluaciones-store";
import { Evaluacion, EvaluacionFormData } from "@/types/evaluacion";
import { Student } from "@/types/student";

export default function EvaluacionesProfesorPage() {
  const { session } = useAuth();
  const { confirm, dialog } = useConfirm();
  const profesorId = session?.usuario.id ?? "";
  const [alumnos] = useState<Student[]>(obtenerAlumnos);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>(() =>
    obtenerEvaluacionesPorProfesor(profesorId),
  );
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

  const guardar = (data: EvaluacionFormData, id?: string) => {
    if (id) {
      const actualizada = actualizarEvaluacion(id, data);
      if (actualizada) {
        setEvaluaciones((actuales) =>
          actuales.map((evaluacion) => (evaluacion.id === id ? actualizada : evaluacion)),
        );
      }
    } else {
      const nueva = crearEvaluacion(data, profesorId);
      setEvaluaciones((actuales) => [nueva, ...actuales]);
    }
    cerrarFormulario();
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

    eliminarEvaluacion(evaluacion.id);
    setEvaluaciones((actuales) => actuales.filter((actual) => actual.id !== evaluacion.id));
  };

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">PROFESOR</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Evaluaciones</h1>
            <p className="mt-1 text-sm text-slate-500">Registra el rendimiento y las observaciones de tus alumnos.</p>
          </div>
          <button type="button" onClick={abrirNuevaEvaluacion} disabled={alumnos.length === 0} className="rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12613D] disabled:cursor-not-allowed disabled:opacity-50">
            Registrar evaluación
          </button>
        </header>

        <p className="mb-3 text-sm text-slate-500">{evaluaciones.length} evaluación(es) registrada(s)</p>
        <EvaluacionTabla
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
