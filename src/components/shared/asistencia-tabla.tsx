"use client";

import { RegistroAsistencia } from "@/types/asistencia";

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
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        No se encontraron registros de asistencia con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Estudiante
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">DNI</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Categoría
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Fecha y hora
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Método
            </th>
            {puedeCorregir && (
              <th className="px-4 py-3 text-right font-semibold text-slate-600">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {registros.map((registro) => (
            <tr key={registro.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">
                {registro.estudiante}
              </td>
              <td className="px-4 py-3 text-slate-600">{registro.dni}</td>
              <td className="px-4 py-3 text-slate-700">{registro.categoria}</td>
              <td className="px-4 py-3 text-slate-700">
                {new Intl.DateTimeFormat("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(registro.fechaHora))}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-[#edf8e8] px-2.5 py-0.5 text-xs font-medium text-[#16794C]">
                  {registro.metodo === "ESCANEO" ? "Escaneo" : "Manual"}
                </span>
              </td>
              {puedeCorregir && (
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onCorregir?.(registro)}
                    className="font-semibold text-[#16794C] hover:text-[#12613D]"
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
  );
}
