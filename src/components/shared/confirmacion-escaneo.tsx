"use client";

import {
  EstudianteAsistencia,
  MetodoAsistencia,
} from "@/types/asistencia";

interface ConfirmacionEscaneoProps {
  estudiante: EstudianteAsistencia;
  metodo: MetodoAsistencia;
  fechaHora: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmacionEscaneo({
  estudiante,
  metodo,
  fechaHora,
  onConfirmar,
  onCancelar,
}: ConfirmacionEscaneoProps) {
  const fecha = new Date(fechaHora);

  return (
    <section
      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
      aria-labelledby="confirmacion-asistencia-title"
    >
      <p className="text-sm font-semibold text-emerald-800">
        Estudiante identificado
      </p>
      <h2
        id="confirmacion-asistencia-title"
        className="mt-1 text-xl font-bold text-slate-950"
      >
        Confirma la asistencia
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Revisa los datos antes de guardar el registro.
      </p>

      <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-500">Estudiante</dt>
          <dd>
            {estudiante.nombres} {estudiante.apellidos}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">DNI</dt>
          <dd>{estudiante.dni}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Categoría</dt>
          <dd>{estudiante.categoria}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Método</dt>
          <dd>{metodo === "ESCANEO" ? "Escaneo de DNI" : "Registro manual"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-slate-500">Fecha y hora</dt>
          <dd>
            {new Intl.DateTimeFormat("es-PE", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(fecha)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onConfirmar}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Confirmar asistencia
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}
