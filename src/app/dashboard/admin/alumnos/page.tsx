"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import AlumnoFiltros from "@/components/shared/alumno-filtros";
import AlumnoTabla from "@/components/shared/alumno-tabla";
import AlumnoForm from "@/components/forms/alumno-form";
import { descargarCarnetAlumno } from "@/lib/descargar-carnet-alumno";
import { useConfirm } from "@/hooks/use-confirm";
import { Student, StudentFormData } from "@/types/student";
import {
  actualizarAlumno,
  crearAlumno,
  eliminarAlumno,
  filtrarAlumnos,
  obtenerAlumnos,
} from "@/store/alumnos-store";

export default function AlumnosAdminPage() {
  const [alumnos, setAlumnos] = useState<Student[]>(obtenerAlumnos);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [estado, setEstado] = useState<Student["estado"] | "todos">("todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alumnoAEditar, setAlumnoAEditar] = useState<Student | null>(null);
  const { confirm, dialog } = useConfirm();

  const alumnosFiltrados = useMemo(
    () => filtrarAlumnos(alumnos, { texto, categoria, estado }),
    [alumnos, texto, categoria, estado],
  );

  const handleNuevo = () => {
    setAlumnoAEditar(null);
    setIsModalOpen(true);
  };

  const handleEditar = (alumno: Student) => {
    setAlumnoAEditar(alumno);
    setIsModalOpen(true);
  };

  const handleEliminar = async (alumno: Student) => {
    const confirmado = await confirm({
      title: "Eliminar alumno",
      message: (
        <>
          ¿Seguro que deseas eliminar a{" "}
          <strong>
            {alumno.nombres} {alumno.apellidos}
          </strong>
          ? Esta acción no se puede deshacer.
        </>
      ),
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    eliminarAlumno(alumno.id);
    setAlumnos(obtenerAlumnos());
  };

  const handleGuardar = (data: StudentFormData, id?: string) => {
    if (id) {
      actualizarAlumno(id, data);
    } else {
      crearAlumno(data);
    }
    setAlumnos(obtenerAlumnos());
    setIsModalOpen(false);
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Gestión de alumnos
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Busca, filtra, crea, edita y elimina alumnos del club.
          </p>
        </header>

        <AlumnoFiltros
          texto={texto}
          onTextoChange={setTexto}
          categoria={categoria}
          onCategoriaChange={setCategoria}
          estado={estado}
          onEstadoChange={setEstado}
          onNuevoAlumno={handleNuevo}
        />

        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          {alumnosFiltrados.length} alumno(s) encontrado(s)
        </p>

        <AlumnoTabla
          alumnos={alumnosFiltrados}
          puedeGestionar
          onEditar={handleEditar}
          onEliminar={handleEliminar}
          onDescargarCarnet={descargarCarnetAlumno}
        />

        {isModalOpen && (
          <AlumnoForm
            key={alumnoAEditar?.id ?? "nuevo"}
            alumnoAEditar={alumnoAEditar}
            onClose={() => setIsModalOpen(false)}
            onGuardar={handleGuardar}
          />
        )}

        {dialog}
      </div>
    </RoleGuard>
  );
}
