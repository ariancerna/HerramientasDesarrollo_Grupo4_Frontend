"use client";

import { RegistroAsistencia } from "@/types/asistencia";
import { MobileDataCard, MobileDataList } from "@/components/ui/mobile-data-card";

interface AsistenciaTablaProps {
  registros: RegistroAsistencia[];
  puedeCorregir?: boolean;
  onCorregir?: (registro: RegistroAsistencia) => void;
}

export default function AsistenciaTabla({
  registros,
  puedeCorregir = false,
  onCorregir,
}: AsistenciaTablaProps) {
  if (registros.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No se encontraron registros de asistencia con los filtros aplicados.
      </div>
    );
  }

  return (
    <>
      <MobileDataList>
        {registros.map((registro) => (
          <MobileDataCard
            key={registro.id}
            title={registro.estudiante}
            subtitle={registro.categoria}
            rows={[
              { label: "DNI", value: registro.dni },
              {
                label: "Fecha y hora",
                value: new Intl.DateTimeFormat("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(registro.fechaHora)),
              },
              {
                label: "Método",
                value: registro.metodo === "ESCANEO" ? "Escaneo" : "Manual",
              },
            ]}
            actions={
              puedeCorregir ? (
                <button type="button" onClick={() => onCorregir?.(registro)} className="font-semibold text-primary-dark">
                  Corregir registro
                </button>
              ) : undefined
            }
          />
        ))}
      </MobileDataList>
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:block">
      <table className="w-full min-w-[720px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Estudiante
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">DNI</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Categoría
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Fecha y hora
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
              Método
            </th>
            {puedeCorregir && (
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {registros.map((registro) => (
            <tr key={registro.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                {registro.estudiante}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{registro.dni}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{registro.categoria}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                {new Intl.DateTimeFormat("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(registro.fechaHora))}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-300">
                  {registro.metodo === "ESCANEO" ? "Escaneo" : "Manual"}
                </span>
              </td>
              {puedeCorregir && (
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onCorregir?.(registro)}
                    className="font-semibold text-primary-dark hover:text-primary-hover dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Corregir
                  </button>
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
