"use client";

import { useEffect, useState } from "react";
import { Categoria } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { RoleGuard } from "@/components/shared/role-guard";
import CategoriaForm from "@/components/forms/categoria-form";
import CategoriasTabla from "@/components/shared/categorias-tabla";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "@/store/categorias-store";

export default function CategoriasPage() {
  const { session } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(
    null
  );
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Ocultar mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const cargarCategorias = () => {
    setCategorias(obtenerCategorias());
  };

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
        setMensajeExito(`✅ Categoría "${data.nombre}" actualizada correctamente`);
      } else {
        // Crear nueva categoría
        crearCategoria(data);
        setMensajeExito(`✅ Categoría "${data.nombre}" creada correctamente`);
      }
      cargarCategorias();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      setMensajeExito("❌ Error al guardar la categoría");
    }
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaAEditar(categoria);
    setMostrarFormulario(true);
  };

  const handleEliminarCategoria = (categoria: Categoria) => {
    try {
      eliminarCategoria(categoria.id);
      setMensajeExito(`✅ Categoría "${categoria.nombre}" eliminada correctamente`);
      cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      setMensajeExito("❌ Error al eliminar la categoría");
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
            ➕ Nueva Categoría
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

        {/* Estadísticas */}
        {categorias.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {categorias.length}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Categorías registradas
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {categorias.reduce((sum, cat) => sum + cat.horarios.length, 0)}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Horarios en total
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {categorias.filter((cat) => cat.horarios.length > 0).length}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Categorías con horarios
              </p>
            </div>
          </div>
        )}
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
