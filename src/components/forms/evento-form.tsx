"use client";

import { useState, type FormEvent } from "react";
import { Categoria } from "@/types";
import { EventoClub } from "@/types/calendario";
import { useConfirm } from "@/hooks/use-confirm";

interface EventoFormData {
  titulo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  ubicacion: string;
  categoria: string;
  descripcion: string;
}

interface EventoFormProps {
  eventoAEditar: EventoClub | null;
  categorias: Categoria[];
  onClose: () => void;
  onGuardar: (data: Omit<EventoClub, "id">, id?: string) => void;
}

type Errores = Partial<Record<keyof EventoFormData, string>>;

export default function EventoForm({
  eventoAEditar,
  categorias,
  onClose,
  onGuardar,
}: EventoFormProps) {
  const [form, setForm] = useState<EventoFormData>(() => {
    if (!eventoAEditar) {
      return {
        titulo: "",
        fecha: "",
        horaInicio: "",
        horaFin: "",
        ubicacion: "",
        categoria: "",
        descripcion: "",
      };
    }
    return {
      titulo: eventoAEditar.titulo,
      fecha: eventoAEditar.fecha,
      horaInicio: eventoAEditar.horaInicio,
      horaFin: eventoAEditar.horaFin ?? "",
      ubicacion: eventoAEditar.ubicacion,
      categoria: eventoAEditar.categoria ?? "",
      descripcion: eventoAEditar.descripcion,
    };
  });
  const [errores, setErrores] = useState<Errores>({});
  const { confirm, dialog } = useConfirm();

  const validar = (): boolean => {
    const nuevos: Errores = {};
    if (!form.titulo.trim()) nuevos.titulo = "El título es obligatorio.";
    if (!form.fecha) nuevos.fecha = "Selecciona la fecha.";
    if (!form.horaInicio) nuevos.horaInicio = "Selecciona la hora de inicio.";
    if (!form.ubicacion.trim()) nuevos.ubicacion = "La ubicación es obligatoria.";
    if (!form.descripcion.trim()) nuevos.descripcion = "La descripción es obligatoria.";
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    if (eventoAEditar) {
      const confirmado = await confirm({
        title: "Guardar cambios",
        message: (
          <>
            ¿Deseas guardar los cambios de <strong>{form.titulo}</strong>?
          </>
        ),
        confirmLabel: "Guardar",
        cancelLabel: "Cancelar",
      });
      if (!confirmado) return;
    }

    const datos: Omit<EventoClub, "id"> = {
      titulo: form.titulo.trim(),
      fecha: form.fecha,
      horaInicio: form.horaInicio,
      horaFin: form.horaFin || undefined,
      ubicacion: form.ubicacion.trim(),
      categoria: form.categoria || undefined,
      descripcion: form.descripcion.trim(),
    };

    onGuardar(datos, eventoAEditar?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-6">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {eventoAEditar ? "Editar evento" : "Programar evento o entrenamiento especial"}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Se mostrará en el calendario del club y de los alumnos de la categoría seleccionada.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Título
            </span>
            <input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ej: Torneo interno, Jornada de integración"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.titulo && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.titulo}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fecha
            </span>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.fecha && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.fecha}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Categoría (opcional)
            </span>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Hora de inicio
            </span>
            <input
              type="time"
              value={form.horaInicio}
              onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.horaInicio && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.horaInicio}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Hora de fin (opcional)
            </span>
            <input
              type="time"
              value={form.horaFin}
              onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Ubicación
            </span>
            <input
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.ubicacion && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.ubicacion}</p>
            )}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Descripción
            </span>
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.descripcion && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.descripcion}</p>
            )}
          </label>

          <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12613D] focus:outline-none focus:ring-2 focus:ring-[#16794C] focus:ring-offset-2"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      {dialog}
    </div>
  );
}
