"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import AlumnoFiltros from "@/components/shared/alumno-filtros";
import AlumnoTabla from "@/components/shared/alumno-tabla";
import { Student } from "@/types/student";
import { filtrarAlumnos, obtenerAlumnos } from "@/store/alumnos-store";

export default function AlumnosProfesorPage() {
  const [alumnos] = useState<Student[]>(obtenerAlumnos);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [estado, setEstado] = useState<Student["estado"] | "todos">("todos");

  const alumnosFiltrados = useMemo(
    () => filtrarAlumnos(alumnos, { texto, categoria, estado }),
    [alumnos, texto, categoria, estado],
  );

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
          <header className="mb-6">
            <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">
              PROFESOR
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Alumnos
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulta y filtra la lista de alumnos de tus categorías.
            </p>
          </header>

          {/* Sin onNuevoAlumno: el profesor no gestiona altas/bajas */}
          <AlumnoFiltros
            texto={texto}
            onTextoChange={setTexto}
            categoria={categoria}
            onCategoriaChange={setCategoria}
            estado={estado}
            onEstadoChange={setEstado}
          />

          <p className="mb-3 text-sm text-slate-500">
            {alumnosFiltrados.length} alumno(s) encontrado(s)
          </p>

          {/* puedeGestionar=false (por defecto): oculta editar/eliminar */}
          <AlumnoTabla alumnos={alumnosFiltrados} />
      </div>
    </RoleGuard>
  );
}
