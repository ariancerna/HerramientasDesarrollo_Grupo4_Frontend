"use client";

import { useState } from "react";
import {
  DatosCorreccionAsistencia,
  RegistroAsistencia,
} from "@/types/asistencia";
import { useConfirm } from "@/hooks/use-confirm";

interface AsistenciaFormProps {
  registro: RegistroAsistencia;
  onClose: () => void;
  onGuardar: (datos: DatosCorreccionAsistencia) => void;
}

function formatoFechaInput(fechaHora: string) {
  const fecha = new Date(fechaHora);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatoHoraInput(fechaHora: string) {
  const fecha = new Date(fechaHora);
  return `${String(fecha.getHours()).padStart(2, "0")}:${String(
    fecha.getMinutes(),
  ).padStart(2, "0")}`;
}

export default function AsistenciaForm({
  registro,
  onClose,
  onGuardar,
}: AsistenciaFormProps) {
  const [fecha, setFecha] = useState(() => formatoFechaInput(registro.fechaHora));
  const [hora, setHora] = useState(() => formatoHoraInput(registro.fechaHora));
  const [metodo, setMetodo] = useState(registro.metodo);
  const [error, setError] = useState("");
  const { confirm, dialog } = useConfirm();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const fechaHora = new Date(`${fecha}T${hora}:00`);
    if (!fecha || !hora || Number.isNaN(fechaHora.getTime())) {
      setError("Selecciona una fecha y hora válidas.");
      return;
    }

    const confirmado = await confirm({
      title: "Guardar corrección",
      message: `¿Deseas guardar los cambios en el registro de asistencia de ${registro.estudiante}?`,
      confirmLabel: "Guardar",
      cancelLabel: "Cancelar",
    });
    if (!confirmado) return;

    try {
      onGuardar({ fechaHora: fechaHora.toISOString(), metodo });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo corregir la asistencia.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-6">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Corregir asistencia</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Actualiza la fecha, hora o método del registro de {registro.estudiante}.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fecha
            </span>
            <input
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Hora
            </span>
            <input
              type="time"
              value={hora}
              onChange={(event) => setHora(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Método de registro
            </span>
            <select
              value={metodo}
              onChange={(event) =>
                setMetodo(event.target.value as RegistroAsistencia["metodo"])
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="ESCANEO">Escaneo de DNI</option>
              <option value="MANUAL">Registro manual</option>
            </select>
          </label>

          <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12613D] focus:outline-none focus:ring-2 focus:ring-[#16794C] focus:ring-offset-2"
            >
              Guardar corrección
            </button>
          </div>
        </form>
      </div>

      {dialog}
    </div>
  );
}
