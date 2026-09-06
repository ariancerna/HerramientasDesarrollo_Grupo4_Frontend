"use client";

import { useState } from "react";
import EvaluacionModal from "@/components/evaluaciones/evaluacion-modal";
import { Student } from "@/types/student";
import { Evaluacion, EvaluacionFormData } from "@/types/evaluacion";

interface EvaluacionFormProps {
  alumnos: Student[];
  evaluacionAEditar: Evaluacion | null;
  onClose: () => void;
  onGuardar: (data: EvaluacionFormData, id?: string) => void;
}

type Errores = Partial<Record<"alumnoId" | "fecha" | "observaciones", string>>;

function fechaActual() {
  return new Date().toISOString().slice(0, 10);
}

export default function EvaluacionForm({
  alumnos,
  evaluacionAEditar,
  onClose,
  onGuardar,
}: EvaluacionFormProps) {
  const [form, setForm] = useState<EvaluacionFormData>(() => ({
    alumnoId: evaluacionAEditar?.alumnoId ?? alumnos[0]?.id ?? "",
    fecha: evaluacionAEditar?.fecha ?? fechaActual(),
    rendimientoTecnico: evaluacionAEditar?.rendimientoTecnico,
    rendimientoFisico: evaluacionAEditar?.rendimientoFisico,
    actitud: evaluacionAEditar?.actitud,
    observaciones: evaluacionAEditar?.observaciones ?? "",
  }));
  const [errores, setErrores] = useState<Errores>({});

  const cambiarNota = (
    campo: "rendimientoTecnico" | "rendimientoFisico" | "actitud",
    valor: string,
  ) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor ? Number(valor) : undefined,
    }));
  };

  const validar = () => {
    const nuevosErrores: Errores = {};
    if (!form.alumnoId) nuevosErrores.alumnoId = "Selecciona un alumno.";
    if (!form.fecha) nuevosErrores.fecha = "Selecciona una fecha.";
    if (!form.observaciones.trim()) {
      nuevosErrores.observaciones = "Escribe una observación.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = (event: React.FormEvent) => {
    event.preventDefault();
    if (validar()) onGuardar(form, evaluacionAEditar?.id);
  };

  return (
    <EvaluacionModal
      titulo={evaluacionAEditar ? "Editar evaluación" : "Registrar evaluación"}
      onClose={onClose}
    >
      <form onSubmit={guardar} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Alumno</span>
            <select
              value={form.alumnoId}
              onChange={(event) => setForm({ ...form, alumnoId: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            >
              <option value="">Selecciona un alumno</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombres} {alumno.apellidos}
                </option>
              ))}
            </select>
            {errores.alumnoId && <p className="mt-1 text-xs text-red-600">{errores.alumnoId}</p>}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Fecha</span>
            <input
              type="date"
              value={form.fecha}
              onChange={(event) => setForm({ ...form, fecha: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
            {errores.fecha && <p className="mt-1 text-xs text-red-600">{errores.fecha}</p>}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {([
            ["rendimientoTecnico", "Rendimiento técnico"],
            ["rendimientoFisico", "Rendimiento físico"],
            ["actitud", "Actitud"],
          ] as const).map(([campo, etiqueta]) => (
            <label key={campo}>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">{etiqueta}</span>
              <input
                type="number"
                min={1}
                max={10}
                value={form[campo] ?? ""}
                onChange={(event) => cambiarNota(campo, event.target.value)}
                placeholder="1 a 10"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
              />
            </label>
          ))}
        </div>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Observaciones</span>
          <textarea
            rows={4}
            value={form.observaciones}
            onChange={(event) => setForm({ ...form, observaciones: event.target.value })}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            placeholder="Describe el rendimiento del alumno..."
          />
          {errores.observaciones && <p className="mt-1 text-xs text-red-600">{errores.observaciones}</p>}
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" className="rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12613D]">
            Guardar evaluación
          </button>
        </div>
      </form>
    </EvaluacionModal>
  );
}