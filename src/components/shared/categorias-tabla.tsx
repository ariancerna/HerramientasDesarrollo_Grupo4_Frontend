"use client";

import { Categoria, Horario } from "@/types";

const DIAS_CORTOS: Record<Horario["dia"], string> = {
  lunes: "Lun",
  martes: "Mar",
  miércoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sábado: "Sáb",
  domingo: "Dom",
};

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
                  <div className="flex flex-wrap gap-1.5">
                    {categoria.horarios.map((horario) => (
                      <span
                        key={horario.id}
                        className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800"
                      >
                        {DIAS_CORTOS[horario.dia]} {horario.horaInicio}–{horario.horaFin}
                      </span>
                    ))}
                  </div>
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
                      <EditIcon />
                      Editar
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
