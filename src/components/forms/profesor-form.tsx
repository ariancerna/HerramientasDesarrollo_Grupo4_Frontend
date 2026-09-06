"use client";

import { useState } from "react";
import { Profesor, Sede } from "@/types";
import { MOCK_USUARIOS } from "@/lib/mock/usuarios.mock";
import { usuarioProfesorDisponible } from "@/store/profesores-store";
import { useConfirm } from "@/hooks/use-confirm";

interface ProfesorFormData {
  nombre: string;
  usuario: string;
  password: string;
  sedeId: string;
}

interface ProfesorFormProps {
  profesorAEditar: Profesor | null;
  sedes: Sede[];
  onClose: () => void;
  onGuardar: (data: Omit<Profesor, "id">, id?: string) => void;
}

type Errores = Partial<Record<keyof ProfesorFormData, string>>;

export default function ProfesorForm({
  profesorAEditar,
  sedes,
  onClose,
  onGuardar,
}: ProfesorFormProps) {
  const [form, setForm] = useState<ProfesorFormData>(() => {
    if (!profesorAEditar) {
      return { nombre: "", usuario: "", password: "", sedeId: sedes[0]?.id ?? "" };
    }
    return {
      nombre: profesorAEditar.nombre,
      usuario: profesorAEditar.usuario,
      password: "",
      sedeId: profesorAEditar.sedeId,
    };
  });
  const [errores, setErrores] = useState<Errores>({});
  const { confirm, dialog } = useConfirm();

  const validar = (): boolean => {
    const nuevosErrores: Errores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!form.usuario.trim()) {
      nuevosErrores.usuario = "El usuario es obligatorio.";
    } else if (!/^[a-zA-Z0-9._-]{3,}$/.test(form.usuario.trim())) {
      nuevosErrores.usuario = "Usa al menos 3 caracteres (letras, números, . _ -).";
    } else {
      const enUsoPorSistema = MOCK_USUARIOS.some(
        (u) => u.usuario.toLowerCase() === form.usuario.trim().toLowerCase(),
      );
      const enUsoPorProfesor = !usuarioProfesorDisponible(
        form.usuario.trim(),
        profesorAEditar?.id,
      );
      if (enUsoPorSistema || enUsoPorProfesor) {
        nuevosErrores.usuario = "Ese usuario ya está en uso.";
      }
    }

    if (!profesorAEditar && form.password.length < 6) {
      nuevosErrores.password = "Mínimo 6 caracteres.";
    } else if (profesorAEditar && form.password && form.password.length < 6) {
      nuevosErrores.password = "Mínimo 6 caracteres.";
    }

    if (!form.sedeId) {
      nuevosErrores.sedeId = "Selecciona una sede.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    if (profesorAEditar) {
      const confirmado = await confirm({
        title: "Guardar cambios",
        message: (
          <>
            ¿Deseas guardar los cambios realizados en <strong>{form.nombre}</strong>?
          </>
        ),
        confirmLabel: "Guardar",
        cancelLabel: "Cancelar",
      });
      if (!confirmado) return;
    }

    const datos: Omit<Profesor, "id"> = {
      nombre: form.nombre.trim(),
      usuario: form.usuario.trim(),
      password: form.password ? form.password : profesorAEditar?.password ?? "",
      sedeId: form.sedeId,
    };
    onGuardar(datos, profesorAEditar?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-6">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {profesorAEditar ? "Editar profesor" : "Nuevo profesor"}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Da de alta cuentas de profesores y asígnalos a una sede.
        </p>

        {sedes.length === 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Primero crea una sede para poder asignar profesores.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nombre completo
            </span>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.nombre && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.nombre}</p>}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Usuario
            </span>
            <input
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.usuario && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.usuario}</p>}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Contraseña{" "}
              {profesorAEditar && (
                <span className="text-slate-400 dark:text-slate-500">(dejar en blanco para no cambiarla)</span>
              )}
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {errores.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.password}</p>}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Sede
            </span>
            <select
              value={form.sedeId}
              onChange={(e) => setForm({ ...form, sedeId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Selecciona una sede</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
            {errores.sedeId && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errores.sedeId}</p>}
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
              disabled={sedes.length === 0}
              className="rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12613D] focus:outline-none focus:ring-2 focus:ring-[#16794C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
