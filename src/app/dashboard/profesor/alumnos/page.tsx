"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { obtenerCategorias } from "@/store/categorias-store";
import AlumnoFiltros from "@/components/shared/alumno-filtros";
import { AlumnoLista } from "@/components/shared/alumno-lista";
import AlumnoForm from "@/components/forms/alumno-form";
import { Student, StudentFormData } from "@/types/student";
import {
  obtenerAlumnos,
  filtrarAlumnos,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno,
} from "@/store/alumnos-store";

export default function AlumnosProfesorPage() {
  const { session } = useAuth();
  const [categoriasAsignadas] = useState(() =>
    obtenerCategorias().filter((categoria) => categoria.profesorIds?.includes(session?.usuario.id ?? "")),
  );
  const nombresCategoriasAsignadas = categoriasAsignadas.map((categoria) => categoria.nombre);
  const [alumnos, setAlumnos] = useState<Student[]>(obtenerAlumnos);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [estado, setEstado] = useState<Student["estado"] | "todos">("todos");
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [alumnoAEditar, setAlumnoAEditar] = useState<Student | null>(null);
  const { confirm, dialog } = useConfirm();

  const alumnosFiltrados = useMemo(
    () => filtrarAlumnos(alumnos.filter((alumno) => nombresCategoriasAsignadas.includes(alumno.categoria)), { texto, categoria, estado }),
    [alumnos, texto, categoria, estado, nombresCategoriasAsignadas],
  );

  const abrirNuevoAlumno = () => {
    setAlumnoAEditar(null);
    setFormularioAbierto(true);
  };

  const abrirModalEdicion = (alumno: Student) => {
    setAlumnoAEditar(alumno);
    setFormularioAbierto(true);
  };

  const cerrarFormulario = () => {
    setFormularioAbierto(false);
    setAlumnoAEditar(null);
  };

  const guardarAlumno = (data: StudentFormData, id?: string) => {
    if (id) {
      const actualizado = actualizarAlumno(id, data);
      if (actualizado) {
        setAlumnos((actuales) =>
          actuales.map((alumno) => (alumno.id === id ? actualizado : alumno)),
        );
      }
    } else {
      const nuevo = crearAlumno(data);
      setAlumnos((actuales) => [nuevo, ...actuales]);
    }

    cerrarFormulario();
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
    setAlumnos((actuales) => actuales.filter((a) => a.id !== alumno.id));
  };

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Alumnos
          </h1>
          <button
            type="button"
            onClick={abrirNuevoAlumno}
            className="inline-flex items-center justify-center rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          >
            Nuevo alumno
          </button>
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

        <AlumnoLista
          alumnos={alumnosFiltrados}
          onEditar={abrirModalEdicion}
          onEliminar={handleEliminar}
        />

        {formularioAbierto && (
          <AlumnoForm
            key={alumnoAEditar?.id ?? "nuevo"}
            alumnoAEditar={alumnoAEditar}
            categoriasDisponibles={nombresCategoriasAsignadas}
            onClose={cerrarFormulario}
            onGuardar={guardarAlumno}
          />
        )}

        {dialog}
      </div>
    </RoleGuard>
  );
}