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
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
        No se encontraron alumnos con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">DNI</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Código</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Nombre completo
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Correo</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Categoría
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Estado</th>
            {puedeGestionar && (
              <th className="px-4 py-3 text-right font-semibold text-slate-600">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {alumnos.map((alumno) => (
            <tr key={alumno.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{alumno.dni}</td>
              <td className="px-4 py-3 text-slate-600">{alumno.codigo}</td>
              <td className="px-4 py-3 text-slate-700">
                {alumno.nombres} {alumno.apellidos}
              </td>
              <td className="px-4 py-3 text-slate-500">{alumno.email}</td>
              <td className="px-4 py-3 text-slate-700">{alumno.categoria}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    alumno.estado === "activo"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {alumno.estado === "activo" ? "Activo" : "Inactivo"}
                </span>
              </td>
              {puedeGestionar && (
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEditar?.(alumno)}
                    className="mr-3 font-medium text-slate-700 hover:text-slate-950"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar?.(alumno)}
                    className="font-medium text-red-600 hover:text-red-800"
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
