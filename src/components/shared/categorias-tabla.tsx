"use client";

import { Categoria } from "@/types";

interface CategoriasTablaProps {
  categorias: Categoria[];
  /** Si es false (perfil no-admin), oculta la columna de acciones. */
  puedeGestionar?: boolean;
  onEditar?: (categoria: Categoria) => void;
  onEliminar?: (categoria: Categoria) => void;
}

export default function CategoriasTabla({
  categorias,
  puedeGestionar = false,
  onEditar,
  onEliminar,
}: CategoriasTablaProps) {
  if (categorias.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        No se encontraron categorías.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[600px] divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Nombre
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Descripción
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Horarios
            </th>
            {puedeGestionar && (
              <th className="px-4 py-3 text-right font-semibold text-slate-600">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categorias.map((categoria) => (
            <tr key={categoria.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">
                {categoria.nombre}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {categoria.descripcion || "—"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {categoria.horarios.length > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {categoria.horarios.length}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-400">Sin horarios</span>
                )}
              </td>

              {puedeGestionar && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditar?.(categoria)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Está seguro de que desea eliminar la categoría "${categoria.nombre}"?\n\nEsta acción no se puede deshacer.`
                          )
                        ) {
                          onEliminar?.(categoria);
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                    >
                      🗑️ Eliminar
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
