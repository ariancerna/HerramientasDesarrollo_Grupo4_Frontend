"use client";

import { Categoria } from "@/types";
import { Student } from "@/types/student";

export type ModoDestinatarios = "todos" | "categoria" | "seleccionados";

interface AnuncioDestinatariosProps {
  alumnos: Student[];
  categorias: Categoria[];
  modo: ModoDestinatarios;
  categoriaId: string;
  seleccionados: string[];
  onModoChange: (modo: ModoDestinatarios) => void;
  onCategoriaChange: (categoriaId: string) => void;
  onSeleccionadosChange: (alumnoIds: string[]) => void;
}

export default function AnuncioDestinatarios({
  alumnos,
  categorias,
  modo,
  categoriaId,
  seleccionados,
  onModoChange,
  onCategoriaChange,
  onSeleccionadosChange,
}: AnuncioDestinatariosProps) {
  const alternarAlumno = (alumnoId: string) => {
    onSeleccionadosChange(
      seleccionados.includes(alumnoId)
        ? seleccionados.filter((id) => id !== alumnoId)
        : [...seleccionados, alumnoId],
    );
  };

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1.5 text-sm font-medium text-slate-700">Destinatarios</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {([
          ["todos", "Todos los alumnos"],
          ["categoria", "Una categoría"],
          ["seleccionados", "Alumnos específicos"],
        ] as const).map(([valor, etiqueta]) => (
          <label key={valor} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 hover:bg-slate-50">
            <input
              type="radio"
              name="modo-destinatarios"
              value={valor}
              checked={modo === valor}
              onChange={() => onModoChange(valor)}
              className="accent-[#16794C]"
            />
            {etiqueta}
          </label>
        ))}
      </div>

      {modo === "categoria" && (
        <select
          value={categoriaId}
          onChange={(event) => onCategoriaChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      )}

      {modo === "seleccionados" && (
        <div className="max-h-44 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
          {alumnos.map((alumno) => (
            <label key={alumno.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={seleccionados.includes(alumno.id)}
                onChange={() => alternarAlumno(alumno.id)}
                className="accent-[#16794C]"
              />
              {alumno.nombres} {alumno.apellidos}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}