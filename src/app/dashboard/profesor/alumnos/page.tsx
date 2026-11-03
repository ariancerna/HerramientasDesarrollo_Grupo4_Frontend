"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useCategorias } from "@/store/categorias-store";
import AlumnoFiltros from "@/components/shared/alumno-filtros";
import { AlumnoLista } from "@/components/shared/alumno-lista";
import AlumnoForm from "@/components/forms/alumno-form";
import { ErrorBanner } from "@/components/shared/error-banner";
import { mensajeError } from "@/lib/api";
import { Student, StudentFormData } from "@/types/student";
import {
  alumnosCargados,
  useAlumnos,
  filtrarAlumnos,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno,
} from "@/store/alumnos-store";

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
  const [error, setError] = useState<string | null>(null);
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

  const guardarAlumno = async (data: StudentFormData, id?: string) => {
    setError(null);
    try {
      if (id) {
        await actualizarAlumno(id, data);
      } else {
        await crearAlumno(data);
      }
      cerrarFormulario();
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar el alumno."));
    }
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

        <div className="mb-5 space-y-3">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
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
          cargando={!alumnosCargados()}
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