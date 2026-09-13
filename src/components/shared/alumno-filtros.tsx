"use client";

import { Student } from "@/types/student";
import { NOMBRES_CATEGORIAS } from "@/lib/mock/categorias.mock";
import { Button } from "@/components/ui/button";
import { CONTROL_CLASS } from "@/components/ui/control-styles";

interface AlumnoFiltrosProps {
  texto: string;
  onTextoChange: (value: string) => void;
  categoria: string;
  onCategoriaChange: (value: string) => void;
  estado: Student["estado"] | "todos";
  onEstadoChange: (value: Student["estado"] | "todos") => void;
  onNuevoAlumno?: () => void;
  categorias?: string[];
}

export default function AlumnoFiltros({
  texto,
  onTextoChange,
  categoria,
  onCategoriaChange,
  estado,
  onEstadoChange,
  onNuevoAlumno,
  categorias = NOMBRES_CATEGORIAS,
}: AlumnoFiltrosProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 lg:flex-row">
        <input
          value={texto}
          onChange={(e) => onTextoChange(e.target.value)}
          placeholder="Buscar por nombre, apellido, DNI o código..."
          className={`${CONTROL_CLASS} lg:w-72`}
        />

        <select
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className={`${CONTROL_CLASS} lg:w-52`}
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((c) => (
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
          className={`${CONTROL_CLASS} lg:w-40`}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {onNuevoAlumno && (
        <Button
          onClick={onNuevoAlumno}
          className="whitespace-nowrap"
        >
          + Nuevo alumno
        </Button>
      )}
    </div>
  );
}
