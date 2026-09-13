"use client";

import { Student } from "@/types/student";

interface AlumnoTablaProps {
  alumnos: Student[];
  /** Si es false (perfil profesor), oculta la columna de acciones. */
  puedeGestionar?: boolean;
  onEditar?: (alumno: Student) => void;
  onEliminar?: (alumno: Student) => void;
}

export default function AlumnoTabla({
  alumnos,
  puedeGestionar = false,
  onEditar,
  onEliminar,
}: AlumnoTablaProps) {
  if (alumnos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No se encontraron alumnos con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full min-w-[760px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">DNI</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Código</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Nombre completo
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Correo</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Categoría
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Estado</th>
            {puedeGestionar && (
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {alumnos.map((alumno) => (
            <tr key={alumno.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{alumno.dni}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{alumno.codigo}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                {alumno.nombres} {alumno.apellidos}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{alumno.email}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{alumno.categoria}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    alumno.estado === "activo"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {alumno.estado === "activo" ? "Activo" : "Inactivo"}
                </span>
              </td>
              {puedeGestionar && (
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEditar?.(alumno)}
                    className="mr-3 font-semibold text-primary-dark hover:text-primary-hover dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar?.(alumno)}
                    className="font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
