"use client";

import { Evaluacion } from "@/types/evaluacion";

interface EvaluacionTablaProps {
  evaluaciones: Evaluacion[];
  nombresAlumnos: Record<string, string>;
  onEditar: (evaluacion: Evaluacion) => void;
  onEliminar: (evaluacion: Evaluacion) => void;
}

function mostrarNota(nota?: number) {
  return nota === undefined ? "-" : `${nota}/10`;
}

export default function EvaluacionTabla({
  evaluaciones,
  nombresAlumnos,
  onEditar,
  onEliminar,
}: EvaluacionTablaProps) {
  if (evaluaciones.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No hay evaluaciones registradas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full min-w-[900px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Alumno</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Fecha</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Técnico</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Físico</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Actitud</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Observaciones</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {evaluaciones.map((evaluacion) => (
            <tr key={evaluacion.id} className="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                {nombresAlumnos[evaluacion.alumnoId] ?? "Alumno no encontrado"}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{evaluacion.fecha}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{mostrarNota(evaluacion.rendimientoTecnico)}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{mostrarNota(evaluacion.rendimientoFisico)}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{mostrarNota(evaluacion.actitud)}</td>
              <td className="max-w-xs px-4 py-3 text-slate-600 dark:text-slate-400">{evaluacion.observaciones}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button type="button" onClick={() => onEditar(evaluacion)} className="mr-3 font-semibold text-[#16794C] hover:text-[#12613D]">
                  Editar
                </button>
                <button type="button" onClick={() => onEliminar(evaluacion)} className="font-medium text-red-600 hover:text-red-800">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
