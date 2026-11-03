"use client";

import { avisar } from "@/components/ui/toaster";
import { useState, useSyncExternalStore } from "react";
import { Categoria } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { RoleGuard } from "@/components/shared/role-guard";
import CategoriaForm from "@/components/forms/categoria-form";
import { CategoriasLista } from "@/components/shared/categorias-lista";
import {
  obtenerCategorias,
  obtenerCategoriasIniciales,
  suscribirCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "@/store/categorias-store";
import { mensajeError } from "@/lib/api";
import { ErrorBanner } from "@/components/shared/error-banner";

export default function CategoriasPage() {
  const categorias = useSyncExternalStore(
    suscribirCategorias,
    obtenerCategorias,
    obtenerCategoriasIniciales
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();


  const handleAbrirFormularioNuevo = () => {
    setCategoriaAEditar(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setCategoriaAEditar(null);
  };

  const handleGuardarCategoria = async (
    data: Omit<Categoria, "id">,
    id?: string
  ) => {
    setError(null);
    try {
      if (id) {
        await actualizarCategoria(id, data);
        avisar(`Categoría "${data.nombre}" actualizada correctamente`);
      } else {
        await crearCategoria(data);
        avisar(`Categoría "${data.nombre}" creada correctamente`);
      }
    } catch (err) {
      setError(mensajeError(err, "Error al guardar la categoría"));
    }
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaAEditar(categoria);
    setMostrarFormulario(true);
  };

  const handleEliminarCategoria = async (categoria: Categoria) => {
    const confirmado = await confirm({
      title: "Eliminar categoría",
      message: (
        <>
          ¿Está seguro de que desea eliminar la categoría{" "}
          <strong>{categoria.nombre}</strong>? Esta acción no se puede deshacer.
        </>
      ),
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;

    setError(null);
    try {
      await eliminarCategoria(categoria.id);
      avisar(`Categoría "${categoria.nombre}" eliminada correctamente`);
    } catch (err) {
      setError(mensajeError(err, "Error al eliminar la categoría"));
    }
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Categorías</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Gestiona las categorías y horarios de entrenamiento del club
            </p>
          </div>
          <button
            onClick={handleAbrirFormularioNuevo}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark transition focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon />
            Nueva Categoría
          </button>
        </div>


        <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />

        <CategoriasLista
          categorias={categorias}
          onEditar={handleEditarCategoria}
          onEliminar={handleEliminarCategoria}
        />
      </div>

      {mostrarFormulario && (
        <CategoriaForm
          categoriaAEditar={categoriaAEditar}
          onClose={handleCerrarFormulario}
          onGuardar={handleGuardarCategoria}
        />
      )}

      {dialog}
    </RoleGuard>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}