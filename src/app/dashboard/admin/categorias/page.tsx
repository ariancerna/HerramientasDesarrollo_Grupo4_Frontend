"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Categoria } from "@/types";
import { useAuth } from "@/hooks/use-auth";
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

  // Ocultar mensaje de éxito después de 3 segundos
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
        // Actualizar categoría existente
        actualizarCategoria(id, data);
        setMensajeExito(`Categoría "${data.nombre}" actualizada correctamente`);
      } else {
        // Crear nueva categoría
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

  const handleEliminarCategoria = (categoria: Categoria) => {
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona las categorías y horarios de entrenamiento del club
            </p>
          </div>
          <button
            onClick={handleAbrirFormularioNuevo}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon />
            Nueva Categoría
          </button>
        </div>

        {/* Toast de éxito */}
        {mensajeExito && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm animate-in fade-in">
            <p className="font-medium">{mensajeExito}</p>
          </div>
        )}

        {/* Tabla de categorías */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
