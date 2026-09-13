"use client";

import { useState } from "react";
import { Sede } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";

interface SedeFormProps {
  sedeAEditar: Sede | null;
  onClose: () => void;
  onGuardar: (data: Omit<Sede, "id">, id?: string) => void;
}

type Errores = Partial<{ nombre: string }>;

const formularioVacio: Omit<Sede, "id"> = { nombre: "", direccion: "" };

export default function SedeForm({ sedeAEditar, onClose, onGuardar }: SedeFormProps) {
  const [form, setForm] = useState<Omit<Sede, "id">>(() => {
    if (!sedeAEditar) return formularioVacio;
    return { nombre: sedeAEditar.nombre, direccion: sedeAEditar.direccion ?? "" };
  });
  const [errores, setErrores] = useState<Errores>({});
  const { confirm, dialog } = useConfirm();
  const dialogRef = useModalAccessibility({ onDismiss: onClose });

  const validar = (): boolean => {
    const nuevosErrores: Errores = {};
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre de la sede es obligatorio.";
    } else if (form.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener mínimo 3 caracteres.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    if (sedeAEditar) {
      const confirmado = await confirm({
        title: "Guardar cambios",
        message: (
          <>
            ¿Deseas guardar los cambios realizados en la sede <strong>{form.nombre}</strong>?
          </>
        ),
        confirmLabel: "Guardar",
        cancelLabel: "Cancelar",
      });
      if (!confirmado) return;
    }

    onGuardar(form, sedeAEditar?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-6">
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="sede-form-title" className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <h2 id="sede-form-title" className="text-lg font-bold text-slate-950 dark:text-white">
          {sedeAEditar ? "Editar sede" : "Nueva sede"}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Registra los locales donde opera el club.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nombre de la sede
            </span>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Puente Piedra"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.nombre && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.nombre}</p>}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Dirección <span className="text-slate-400 dark:text-slate-500">(opcional)</span>
            </span>
            <input
              value={form.direccion ?? ""}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              placeholder="Ej: Av. Principal 123"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
