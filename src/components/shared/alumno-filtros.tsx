"use client";

import { Student } from "@/types/student";
import { NOMBRES_CATEGORIAS } from "@/lib/mock/categorias.mock";

interface AlumnoFiltrosProps {
  texto: string;
  onTextoChange: (value: string) => void;
  categoria: string;
  onCategoriaChange: (value: string) => void;
  estado: Student["estado"] | "todos";
  onEstadoChange: (value: Student["estado"] | "todos") => void;
  onNuevoAlumno?: () => void;
}

export default function AlumnoFiltros({
  texto,
  onTextoChange,
  categoria,
  onCategoriaChange,
  estado,
  onEstadoChange,
  onNuevoAlumno,
}: AlumnoFiltrosProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <input
          value={texto}
          onChange={(e) => onTextoChange(e.target.value)}
          placeholder="Buscar por nombre, apellido, DNI o código..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 md:w-72"
        />

        <select
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 md:w-52"
        >
          <option value="todas">Todas las categorías</option>
          {NOMBRES_CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={estado}
          onChange={(e) =>
            onEstadoChange(e.target.value as Student["estado"] | "todos")
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 md:w-40"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {onNuevoAlumno && (
        <button
          onClick={onNuevoAlumno}
          className="whitespace-nowrap rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12613D] focus:outline-none focus:ring-2 focus:ring-[#16794C] focus:ring-offset-2"
        >
          + Nuevo alumno
        </button>
      )}
    </div>
  );
}
