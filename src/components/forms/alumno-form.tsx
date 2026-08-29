"use client";

import { useState } from "react";
import { Student, StudentFormData } from "@/types/student";
import { NOMBRES_CATEGORIAS } from "@/lib/mock/categorias.mock";

interface AlumnoFormProps {
  alumnoAEditar: Student | null;
  onClose: () => void;
  onGuardar: (data: StudentFormData, id?: string) => void;
}

const formularioVacio: StudentFormData = {
  dni: "",
  codigo: "",
  nombres: "",
  apellidos: "",
  email: "",
  categoria: NOMBRES_CATEGORIAS[0],
  carrera: "",
  ciclo: undefined,
  estado: "activo",
};

type Errores = Partial<Record<keyof StudentFormData, string>>;

export default function AlumnoForm({
  alumnoAEditar,
  onClose,
  onGuardar,
}: AlumnoFormProps) {
  const [form, setForm] = useState<StudentFormData>(() => {
    if (!alumnoAEditar) return formularioVacio;

    return {
      dni: alumnoAEditar.dni,
      codigo: alumnoAEditar.codigo,
      nombres: alumnoAEditar.nombres,
      apellidos: alumnoAEditar.apellidos,
      email: alumnoAEditar.email,
      categoria: alumnoAEditar.categoria,
      carrera: alumnoAEditar.carrera,
      ciclo: alumnoAEditar.ciclo,
      estado: alumnoAEditar.estado,
    };
  });
  const [errores, setErrores] = useState<Errores>({});

  const validar = (): boolean => {
    const nuevosErrores: Errores = {};

    if (!/^\d{8}$/.test(form.dni)) {
      nuevosErrores.dni = "El DNI debe tener exactamente 8 dígitos.";
    }
    if (!form.codigo.trim()) {
      nuevosErrores.codigo = "El código es obligatorio.";
    }
    if (!form.nombres.trim()) {
      nuevosErrores.nombres = "Los nombres son obligatorios.";
    }
    if (!form.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    }
    if (!form.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nuevosErrores.email = "El correo no tiene un formato válido.";
    }
    if (!form.categoria) {
      nuevosErrores.categoria = "Selecciona una categoría.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    onGuardar(form, alumnoAEditar?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-6">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
        <h2 className="text-lg font-bold text-slate-950">
          {alumnoAEditar ? "Editar alumno" : "Nuevo alumno"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Completa los datos del jugador.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              DNI
            </span>
            <input
              value={form.dni}
              onChange={(e) =>
                setForm({ ...form, dni: e.target.value.replace(/\D/g, "").slice(0, 8) })
              }
              inputMode="numeric"
              placeholder="8 dígitos"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
            {errores.dni && <p className="mt-1 text-xs text-red-600">{errores.dni}</p>}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Código
            </span>
            <input
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
            {errores.codigo && (
              <p className="mt-1 text-xs text-red-600">{errores.codigo}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Nombres
            </span>
            <input
              value={form.nombres}
              onChange={(e) => setForm({ ...form, nombres: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
            {errores.nombres && (
              <p className="mt-1 text-xs text-red-600">{errores.nombres}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Apellidos
            </span>
            <input
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
            {errores.apellidos && (
              <p className="mt-1 text-xs text-red-600">{errores.apellidos}</p>
            )}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Correo electrónico
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
            {errores.email && (
              <p className="mt-1 text-xs text-red-600">{errores.email}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Categoría
            </span>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            >
              {NOMBRES_CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Estado
            </span>
            <select
              value={form.estado}
              onChange={(e) =>
                setForm({ ...form, estado: e.target.value as StudentFormData["estado"] })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Carrera <span className="text-slate-400">(opcional)</span>
            </span>
            <input
              value={form.carrera ?? ""}
              onChange={(e) => setForm({ ...form, carrera: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Ciclo <span className="text-slate-400">(opcional)</span>
            </span>
            <input
              type="number"
              min={1}
              max={10}
              value={form.ciclo ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  ciclo: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            />
          </label>

          <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
    </div>
  );
}
