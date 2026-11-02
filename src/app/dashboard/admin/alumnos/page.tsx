"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import AlumnoFiltros from "@/components/shared/alumno-filtros";
import { AlumnoLista } from "@/components/shared/alumno-lista";
import AlumnoForm from "@/components/forms/alumno-form";
import { useConfirm } from "@/hooks/use-confirm";
import { Student, StudentFormData } from "@/types/student";
import {
  actualizarAlumno,
  crearAlumno,
  eliminarAlumno,
  filtrarAlumnos,
  useAlumnos,
} from "@/store/alumnos-store";
import { mensajeError } from "@/lib/api";
import { ErrorBanner } from "@/components/shared/error-banner";

export default function AlumnosAdminPage() {
  const alumnos = useAlumnos();
  const [error, setError] = useState<string | null>(null);
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
      title: "Dar de baja al alumno",
      message: (
        <>
          ¿Seguro que deseas dar de baja a{" "}
          <strong>
            {alumno.nombres} {alumno.apellidos}
          </strong>
          ? Quedará como inactivo y se conservará su historial de asistencias y pagos.
        </>
      ),
      confirmLabel: "Dar de baja",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    setError(null);
    try {
      await eliminarAlumno(alumno.id);
    } catch (err) {
      setError(mensajeError(err, "No se pudo dar de baja al alumno."));
    }
  };

  const handleGuardar = async (data: StudentFormData, id?: string) => {
    setError(null);
    try {
      if (id) {
        await actualizarAlumno(id, data);
      } else {
        await crearAlumno(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar el alumno."));
    }
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Gestión de alumnos
          </h1>
        </header>

        <div className="mb-5 space-y-3">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
          <AlumnoFiltros
            texto={texto}
            onTextoChange={setTexto}
            categoria={categoria}
            onCategoriaChange={setCategoria}
            estado={estado}
            onEstadoChange={setEstado}
            onNuevoAlumno={handleNuevo}
          />
        </div>

        <AlumnoLista
          alumnos={alumnosFiltrados}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
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