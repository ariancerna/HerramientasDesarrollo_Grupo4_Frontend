"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerCategorias } from "@/store/categorias-store";
import AlumnoFiltros from "@/components/shared/alumno-filtros";
import AlumnoTabla from "@/components/shared/alumno-tabla";
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
  const [alumnoAEliminar, setAlumnoAEliminar] = useState<Student | null>(null);

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

  const abrirConfirmacionEliminacion = (alumno: Student) => {
    setAlumnoAEliminar(alumno);
  };

  const confirmarEliminacion = () => {
    if (!alumnoAEliminar) return;

    eliminarAlumno(alumnoAEliminar.id);
    setAlumnos((actuales) =>
      actuales.filter((alumno) => alumno.id !== alumnoAEliminar.id),
    );
    setAlumnoAEliminar(null);
  };

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
            
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Alumnos
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Consulta y filtra la lista de alumnos de tus categorías.
            </p>
            </div>
            <button
              type="button"
              onClick={abrirNuevoAlumno}
              className="inline-flex items-center justify-center rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              Nuevo alumno
            </button>
          </header>

          <AlumnoFiltros
            texto={texto}
            onTextoChange={setTexto}
            categoria={categoria}
            onCategoriaChange={setCategoria}
            estado={estado}
            onEstadoChange={setEstado}
            categorias={nombresCategoriasAsignadas}
          />

        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          {alumnosFiltrados.length} alumno(s) encontrado(s)
        </p>

        <AlumnoTabla
          alumnos={alumnosFiltrados}
          puedeGestionar
          onEditar={abrirModalEdicion}
          onEliminar={abrirConfirmacionEliminacion}
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

        {alumnoAEliminar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirmar-eliminacion-title"
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <h2
                id="confirmar-eliminacion-title"
                className="text-lg font-bold text-slate-950 dark:text-white"
              >
                ¿Eliminar alumno?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Se eliminará a {alumnoAEliminar.nombres} {alumnoAEliminar.apellidos}.
                Esta acción no se puede deshacer.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAlumnoAEliminar(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarEliminacion}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}