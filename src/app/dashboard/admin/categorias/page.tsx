"use client";

import { useState, useSyncExternalStore } from "react";
import { Categoria } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { RoleGuard } from "@/components/shared/role-guard";
import CategoriaForm from "@/components/forms/categoria-form";
import CategoriasTabla from "@/components/shared/categorias-tabla";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
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
  const { confirm, dialog } = useConfirm();
  const { notify } = useToast();

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
        // Actualizar categoría existente
        actualizarCategoria(id, data);
        notify({
          title: "Categoría actualizada",
          description: `Se guardaron los cambios de “${data.nombre}”.`,
        });
      } else {
        // Crear nueva categoría
        crearCategoria(data);
        notify({
          title: "Categoría creada",
          description: `“${data.nombre}” ya está disponible en el sistema.`,
        });
      }
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      notify({ title: "No se pudo guardar la categoría", variant: "error" });
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
      notify({
        title: "Categoría eliminada",
        description: `“${categoria.nombre}” fue retirada del sistema.`,
      });
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      notify({ title: "No se pudo eliminar la categoría", variant: "error" });
    }
  };

  const isAdmin = session?.usuario.rol === "administrador";

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Categorías</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              Gestiona las categorías y horarios de entrenamiento del club
            </p>
          </div>
          <Button
            onClick={handleAbrirFormularioNuevo}
            className="px-6 sm:w-auto"
          >
            <PlusIcon />
            Nueva Categoría
          </Button>
        </div>

        {/* Tabla de categorías */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <CategoriasTabla
            categorias={categorias}
            puedeGestionar={isAdmin}
            onEditar={handleEditarCategoria}
            onEliminar={handleEliminarCategoria}
          />
        </div>

      </div>

      {/* Modal del formulario */}
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
