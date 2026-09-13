"use client";

import { Categoria, Profesor, Sede } from "@/types";

interface ProfesoresTablaProps {
  profesores: Profesor[];
  sedes: Sede[];
  categorias: Categoria[];
  onEditar?: (profesor: Profesor) => void;
  onEliminar?: (profesor: Profesor) => void;
}

export default function ProfesoresTabla({
  profesores,
  sedes,
  categorias,
  onEditar,
  onEliminar,
}: ProfesoresTablaProps) {
  const nombreSede = (sedeId: string) => sedes.find((s) => s.id === sedeId)?.nombre ?? "—";

  const categoriasDelProfesor = (profesorId: string) =>
    categorias.filter((categoria) => categoria.profesorIds?.includes(profesorId));

  if (profesores.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No se encontraron profesores.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full min-w-[720px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Nombre</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Usuario</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Sede</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Categorías</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {profesores.map((profesor) => (
            <tr key={profesor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{profesor.nombre}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{profesor.usuario}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300">
                  {nombreSede(profesor.sedeId)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {categoriasDelProfesor(profesor.id).length > 0 ? (
                    categoriasDelProfesor(profesor.id).map((categoria) => (
                      <span key={categoria.id} className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                        {categoria.nombre}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">Sin asignar</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEditar?.(profesor)}
                  className="mr-3 font-semibold text-primary-dark hover:text-primary-hover dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar?.(profesor)}
                  className="font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
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
