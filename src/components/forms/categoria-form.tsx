"use client";

import { useState } from "react";
import { Categoria, Horario } from "@/types";
import { HorarioForm } from "./horario-form";
import { useConfirm } from "@/hooks/use-confirm";

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
  const { confirm, dialog } = useConfirm();

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

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (form.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener mínimo 3 caracteres.";
    }

    if (form.descripcion && !form.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción no puede estar vacía.";
    }

    if (form.horarios.length === 0) {
      nuevosErrores.horarios = "Debe agregar al menos un horario.";
    } else if (!validarHorariosUnicos(form.horarios)) {
      nuevosErrores.horarios = "No puede haber dos horarios en el mismo día.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarErrores(true);

    if (!validar()) return;

    if (categoriaAEditar) {
      const confirmado = await confirm({
        title: "Guardar cambios",
        message: (
          <>
            ¿Deseas guardar los cambios realizados en la categoría{" "}
            <strong>{form.nombre}</strong>?
          </>
        ),
        confirmLabel: "Guardar",
        cancelLabel: "Cancelar",
      });
      if (!confirmado) return;
    }

    onGuardar(form, categoriaAEditar?.id);
    onClose();
  };

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

  const actualizarHorario = (index: number, horario: Horario) => {
    const nuevosHorarios = [...form.horarios];
    nuevosHorarios[index] = horario;
    setForm({
      ...form,
      horarios: nuevosHorarios,
    });
  };

  const eliminarHorario = (index: number) => {
    setForm({
      ...form,
      horarios: form.horarios.filter((_, i) => i !== index),
    });
  };

  const diaOcupado = (indiceBuscado: number, dia: string): boolean => {
    return form.horarios.some(
      (h, i) => i !== indiceBuscado && h.dia === dia
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-slate-900">
        <div className="sticky top-0 bg-white border-b p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            {categoriaAEditar ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
              className={`w-full border rounded-lg px-4 py-2 text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                mostrarErrores && errores.nombre
                  ? "border-red-500 bg-red-50 focus:ring-red-500 dark:bg-red-500/10"
                  : "border-slate-300 focus:ring-brand-green dark:border-slate-600"
              }`}
            />
            {mostrarErrores && errores.nombre && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
              className={`w-full border rounded-lg px-4 py-2 text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                mostrarErrores && errores.descripcion
                  ? "border-red-500 bg-red-50 focus:ring-red-500 dark:bg-red-500/10"
                  : "border-slate-300 focus:ring-brand-green dark:border-slate-600"
              }`}
            />
            {mostrarErrores && errores.descripcion && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errores.descripcion}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Horarios de entrenamiento *
              </label>
              <button
                type="button"
                onClick={agregarHorario}
                className="text-xs bg-brand-green text-white px-3 py-1 rounded hover:bg-brand-green-dark transition"
              >
                + Agregar horario
              </button>
            </div>

            {form.horarios.length === 0 && (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-slate-500 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                No hay horarios. Haz click en &quot;Agregar horario&quot; para comenzar.
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
              <p className="text-red-600 dark:text-red-400 text-xs mt-2">{errores.horarios}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-brand-green rounded-lg hover:bg-brand-green-dark transition"
            >
              {categoriaAEditar ? "Actualizar" : "Crear"} categoría
            </button>
          </div>
        </form>
      </div>

      {dialog}
    </div>
  );
}