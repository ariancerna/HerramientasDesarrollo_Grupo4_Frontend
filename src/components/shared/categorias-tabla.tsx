"use client";

import { Categoria, Horario } from "@/types";
import { MobileDataCard, MobileDataList } from "@/components/ui/mobile-data-card";

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
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No se encontraron categorías.
      </div>
    );
  }

  return (
    <>
      <MobileDataList>
        {categorias.map((categoria) => (
          <MobileDataCard
            key={categoria.id}
            title={categoria.nombre}
            subtitle={categoria.descripcion || "Sin descripción"}
            rows={[
              {
                label: "Horarios",
                value: categoria.horarios.length > 0
                  ? categoria.horarios
                      .map((horario) => `${DIAS_CORTOS[horario.dia]} ${horario.horaInicio}–${horario.horaFin}`)
                      .join(", ")
                  : "Sin horarios",
              },
            ]}
            actions={
              puedeGestionar ? (
                <>
                  <button type="button" onClick={() => onEditar?.(categoria)} className="font-semibold text-primary-dark">Editar</button>
                  <button type="button" onClick={() => onEliminar?.(categoria)} className="font-semibold text-red-600 dark:text-red-400">Eliminar</button>
                </>
              ) : undefined
            }
          />
        ))}
      </MobileDataList>
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:block">
      <table className="w-full min-w-[600px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Nombre
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Descripción
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Horarios
            </th>
            {puedeGestionar && (
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {categorias.map((categoria) => (
            <tr key={categoria.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                {categoria.nombre}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                {categoria.descripcion || "—"}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                {categoria.horarios.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {categoria.horarios.map((horario) => (
                      <span
                        key={horario.id}
                        className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300"
                      >
                        {DIAS_CORTOS[horario.dia]} {horario.horaInicio}–{horario.horaFin}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">Sin horarios</span>
                )}
              </td>

              {puedeGestionar && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditar?.(categoria)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                    >
                      <EditIcon />
                      Editar
                    </button>
                    <button
                      onClick={() => onEliminar?.(categoria)}
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
    </>
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
