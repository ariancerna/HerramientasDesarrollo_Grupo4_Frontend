"use client";

import { useState } from "react";
import { Categoria, Horario } from "@/types";
import { HorarioForm } from "./horario-form";

interface CategoriaFormProps {
  categoriaAEditar: Categoria | null;
  onClose: () => void;
  onGuardar: (data: Omit<Categoria, "id">, id?: string) => void;
}

type Errores = Partial<{
  nombre: string;
  descripcion: string;
  horarios: string;
}>;

const formularioVacio: Omit<Categoria, "id"> = {
  nombre: "",
  descripcion: "",
  horarios: [],
};

export default function CategoriaForm({
  categoriaAEditar,
  onClose,
  onGuardar,
}: CategoriaFormProps) {
  const [form, setForm] = useState<Omit<Categoria, "id">>(() => {
    if (!categoriaAEditar) return formularioVacio;
    return {
      nombre: categoriaAEditar.nombre,
      descripcion: categoriaAEditar.descripcion || "",
      horarios: categoriaAEditar.horarios || [],
    };
  });

  const [errores, setErrores] = useState<Errores>({});
  const [mostrarErrores, setMostrarErrores] = useState(false);

  /**
   * Valida que no haya dos horarios en el mismo día
   */
  const validarHorariosUnicos = (horarios: Horario[]): boolean => {
    const dias = horarios.map((h) => h.dia);
    const diasUnicos = new Set(dias);

    if (dias.length !== diasUnicos.size) {
      return false;
    }
    return true;
  };

  /**
   * Valida todos los campos del formulario
   */
  const validar = (): boolean => {
    const nuevosErrores: Errores = {};

    // Validar nombre
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (form.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener mínimo 3 caracteres.";
    }

    // Validar descripción (opcional, pero si existe no puede estar vacía)
    if (form.descripcion && !form.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción no puede estar vacía.";
    }

    // Validar horarios
    if (form.horarios.length === 0) {
      nuevosErrores.horarios = "Debe agregar al menos un horario.";
    } else if (!validarHorariosUnicos(form.horarios)) {
      nuevosErrores.horarios = "No puede haber dos horarios en el mismo día.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarErrores(true);

    if (!validar()) return;

    onGuardar(form, categoriaAEditar?.id);
    onClose();
  };

  /**
   * Agregar un nuevo horario vacío
   */
  const agregarHorario = () => {
    const nuevoHorario: Horario = {
      id: `h-${Date.now()}`,
      dia: "lunes",
      horaInicio: "09:00",
      horaFin: "11:00",
    };

    setForm({
      ...form,
      horarios: [...form.horarios, nuevoHorario],
    });
  };

  /**
   * Actualizar un horario existente
   */
  const actualizarHorario = (index: number, horario: Horario) => {
    const nuevosHorarios = [...form.horarios];
    nuevosHorarios[index] = horario;
    setForm({
      ...form,
      horarios: nuevosHorarios,
    });
  };

  /**
   * Eliminar un horario
   */
  const eliminarHorario = (index: number) => {
    setForm({
      ...form,
      horarios: form.horarios.filter((_, i) => i !== index),
    });
  };

  /**
   * Verificar si un día ya está ocupado (para otro horario)
   */
  const diaOcupado = (indiceBuscado: number, dia: string): boolean => {
    return form.horarios.some(
      (h, i) => i !== indiceBuscado && h.dia === dia
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {categoriaAEditar ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la categoría *
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Sub-10, Sub-12, Mayores"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
              className={`w-full border rounded-lg px-4 py-2 text-sm transition focus:outline-none focus:ring-2 ${
                mostrarErrores && errores.nombre
                  ? "border-red-500 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {mostrarErrores && errores.nombre && (
              <p className="text-red-600 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              placeholder="Ej: Categoría formativa mixta para menores de 10 años"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              rows={3}
              className={`w-full border rounded-lg px-4 py-2 text-sm transition focus:outline-none focus:ring-2 ${
                mostrarErrores && errores.descripcion
                  ? "border-red-500 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {mostrarErrores && errores.descripcion && (
              <p className="text-red-600 text-xs mt-1">{errores.descripcion}</p>
            )}
          </div>

          {/* Horarios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Horarios de entrenamiento *
              </label>
              <button
                type="button"
                onClick={agregarHorario}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                + Agregar horario
              </button>
            </div>

            {form.horarios.length === 0 && (
              <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm">
                No hay horarios. Haz click en "Agregar horario" para comenzar.
              </div>
            )}

            <div className="space-y-3">
              {form.horarios.map((horario, index) => (
                <HorarioForm
                  key={horario.id}
                  horario={horario}
                  onChange={(actualizado: Horario) =>
                    actualizarHorario(index, actualizado)
                  }
                  onEliminar={() => eliminarHorario(index)}
                  diaOcupado={diaOcupado(index, horario.dia)}
                />
              ))}
            </div>

            {mostrarErrores && errores.horarios && (
              <p className="text-red-600 text-xs mt-2">{errores.horarios}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              {categoriaAEditar ? "Actualizar" : "Crear"} categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
