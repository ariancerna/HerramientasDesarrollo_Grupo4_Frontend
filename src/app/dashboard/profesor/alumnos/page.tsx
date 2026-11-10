"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useCategorias } from "@/store/categorias-store";
import AlumnoFiltros from "@/components/shared/alumno-filtros";
import { AlumnoLista } from "@/components/shared/alumno-lista";
import { Student } from "@/types/student";
import { alumnosCargados, useAlumnos, filtrarAlumnos } from "@/store/alumnos-store";

/**
 * Alumnos del profesor (HU-08): solo consulta. Registrar, editar o dar de baja
 * alumnos es exclusivo del administrador (el backend responde 403 al profesor).
 */
export default function AlumnosProfesorPage() {
  const { session } = useAuth();
  const categorias = useCategorias();
  const profesorId = session?.usuario.id ?? "";
  const nombresCategoriasAsignadas = useMemo(
    () =>
      categorias
        .filter((categoria) => categoria.profesorIds?.includes(profesorId))
        .map((categoria) => categoria.nombre),
    [categorias, profesorId],
  );
  // El backend ya limita la lista a los alumnos de las categorías del profesor.
  const alumnos = useAlumnos();
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [estado, setEstado] = useState<Student["estado"] | "todos">("todos");

  const alumnosFiltrados = useMemo(
    () => filtrarAlumnos(alumnos.filter((alumno) => nombresCategoriasAsignadas.includes(alumno.categoria)), { texto, categoria, estado }),
    [alumnos, texto, categoria, estado, nombresCategoriasAsignadas],
  );

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Alumnos
          </h1>
          <p className="mt-1 text-sm text-muted">
            Alumnos de tus categorías. Para registrar o modificar alumnos, comunícate con administración.
          </p>
        </header>

        <div className="mb-5">
          <AlumnoFiltros
            texto={texto}
            onTextoChange={setTexto}
            categoria={categoria}
            onCategoriaChange={setCategoria}
            estado={estado}
            onEstadoChange={setEstado}
            categorias={nombresCategoriasAsignadas}
          />
        </div>

        <AlumnoLista cargando={!alumnosCargados()} alumnos={alumnosFiltrados} />
      </div>
    </RoleGuard>
  );
}
