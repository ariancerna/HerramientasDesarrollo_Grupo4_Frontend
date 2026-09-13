"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Categoria } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { RoleGuard } from "@/components/shared/role-guard";
import CategoriaForm from "@/components/forms/categoria-form";
import CategoriasTabla from "@/components/shared/categorias-tabla";
import {
  obtenerCategorias,
  obtenerCategoriasIniciales,
  suscribirCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "@/store/categorias-store";

export default function CategoriasPage() {
  const { session } = useAuth();
  const categorias = useSyncExternalStore(
    suscribirCategorias,
    obtenerCategorias,
    obtenerCategoriasIniciales
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(
    null
  );
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleAbrirFormularioNuevo = () => {
    setCategoriaAEditar(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setCategoriaAEditar(null);
  };

  const handleGuardarCategoria = (
    data: Omit<Categoria, "id">,
    id?: string
  ) => {
    try {
      if (id) {
        actualizarCategoria(id, data);
        setMensajeExito(`Categoría "${data.nombre}" actualizada correctamente`);
      } else {
        crearCategoria(data);
        setMensajeExito(`Categoría "${data.nombre}" creada correctamente`);
      }
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      setMensajeExito("Error al guardar la categoría");
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

    try {
      eliminarCategoria(categoria.id);
      setMensajeExito(`Categoría "${categoria.nombre}" eliminada correctamente`);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      setMensajeExito("Error al eliminar la categoría");
    }
  };

  const isAdmin = session?.usuario.rol === "administrador";

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">Categorías</h1>
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

        {mensajeExito && (
          <div className="rounded-lg border border-brand-green/20 bg-brand-green-soft p-4 text-sm text-brand-green shadow-sm animate-in fade-in dark:border-brand-green/30 dark:bg-brand-green/10 dark:text-brand-lime-light">
            <p className="font-medium">{mensajeExito}</p>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <CategoriasTabla
            categorias={categorias}
            puedeGestionar={isAdmin}
            onEditar={handleEditarCategoria}
            onEliminar={handleEliminarCategoria}
          />
        </div>

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