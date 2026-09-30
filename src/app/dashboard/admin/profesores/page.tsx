"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Profesor } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { RoleGuard } from "@/components/shared/role-guard";
import ProfesorForm from "@/components/forms/profesor-form";
import { ProfesorLista } from "@/components/shared/profesor-lista";
import {
  obtenerProfesores,
  obtenerProfesoresIniciales,
  suscribirProfesores,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
  filtrarProfesores,
} from "@/store/profesores-store";
import {
  asignarCategoriasAProfesor,
  obtenerCategorias,
  obtenerCategoriasIniciales,
  suscribirCategorias,
} from "@/store/categorias-store";

export default function ProfesoresPage() {
  const profesores = useSyncExternalStore(
    suscribirProfesores,
    obtenerProfesores,
    obtenerProfesoresIniciales,
  );
  const categorias = useSyncExternalStore(
    suscribirCategorias,
    obtenerCategorias,
    obtenerCategoriasIniciales,
  );
  const [texto, setTexto] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [profesorAEditar, setProfesorAEditar] = useState<Profesor | null>(null);
  const { confirm, dialog } = useConfirm();

  const profesoresFiltrados = useMemo(() => {
    const porTexto = filtrarProfesores(profesores, texto);
    if (categoriaFiltro === "todas") return porTexto;

    return porTexto.filter((profesor) => {
      const categoria = categorias.find((c) => c.id === categoriaFiltro);
      return categoria?.profesorIds?.includes(profesor.id) ?? false;
    });
  }, [profesores, texto, categoriaFiltro, categorias]);

  const handleNuevo = () => {
    setProfesorAEditar(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (profesor: Profesor) => {
    setProfesorAEditar(profesor);
    setMostrarFormulario(true);
  };

  const handleGuardar = (data: Omit<Profesor, "id">, categoriaIds: string[], id?: string) => {
    if (id) {
      actualizarProfesor(id, data);
      asignarCategoriasAProfesor(id, categoriaIds);
    } else {
      const profesor = crearProfesor(data);
      asignarCategoriasAProfesor(profesor.id, categoriaIds);
    }
    setMostrarFormulario(false);
    setProfesorAEditar(null);
  };

  const handleEliminar = async (profesor: Profesor) => {
    const confirmado = await confirm({
      title: "Eliminar profesor",
      message: (
        <>
          ¿Seguro que deseas eliminar a <strong>{profesor.nombre}</strong>? Perderá el
          acceso al sistema y esta acción no se puede deshacer.
        </>
      ),
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    eliminarProfesor(profesor.id);
    asignarCategoriasAProfesor(profesor.id, []);
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Profesores
          </h1>
        </header>

        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex-row lg:items-center">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre o usuario..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-72"
          />

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white lg:w-56"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <button
            onClick={handleNuevo}
            className="whitespace-nowrap rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 lg:ml-auto"
          >
            + Nuevo profesor
          </button>
        </div>

        <ProfesorLista
          profesores={profesoresFiltrados}
          categorias={categorias}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />

        {mostrarFormulario && (
          <ProfesorForm
            key={profesorAEditar?.id ?? "nuevo"}
            profesorAEditar={profesorAEditar}
            categorias={categorias}
            onClose={() => setMostrarFormulario(false)}
            onGuardar={handleGuardar}
          />
        )}

        {dialog}
      </div>
    </RoleGuard>
  );
}