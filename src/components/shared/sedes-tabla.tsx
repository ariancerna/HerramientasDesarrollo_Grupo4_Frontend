"use client";

import { Sede } from "@/types";

interface SedesTablaProps {
  sedes: Sede[];
  puedeGestionar?: boolean;
  onEditar?: (sede: Sede) => void;
  onEliminar?: (sede: Sede) => void;
}

export default function SedesTabla({
  sedes,
  puedeGestionar = false,
  onEditar,
  onEliminar,
}: SedesTablaProps) {
  if (sedes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No se encontraron sedes.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full min-w-[520px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Nombre</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Dirección</th>
            {puedeGestionar && (
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sedes.map((sede) => (
            <tr key={sede.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{sede.nombre}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{sede.direccion || "—"}</td>
              {puedeGestionar && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditar?.(sede)}
                      className="inline-flex items-center gap-1 rounded-md bg-brand-green-soft px-3 py-1.5 text-xs font-medium text-brand-green hover:bg-brand-green/20 transition dark:bg-brand-green/10 dark:text-brand-lime-light dark:hover:bg-brand-green/20"
                    >
                      <EditIcon />
                      Editar
                    </button>
                    <button
                      onClick={() => onEliminar?.(sede)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                    >
                      <TrashIcon />
                      Eliminar
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="m4 20 4.2-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.8 7.2 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}