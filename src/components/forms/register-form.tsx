"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface FormState {
  nombre: string;
  usuario: string;
  password: string;
  confirmarPassword: string;
}

interface FormErrors {
  nombre?: string;
  usuario?: string;
  password?: string;
  confirmarPassword?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    nombre: "",
    usuario: "",
    password: "",
    confirmarPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  function validate() {
    const next: FormErrors = {};
    if (!form.nombre.trim()) next.nombre = "El nombre es obligatorio.";
    if (!form.usuario.trim()) next.usuario = "El usuario es obligatorio.";
    if (form.password.length < 6) next.password = "Mínimo 6 caracteres.";
    if (form.confirmarPassword !== form.password) next.confirmarPassword = "Las contraseñas no coinciden.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: reemplazar por la llamada real al backend cuando esté disponible (Sprint 2).
    setTimeout(() => {
      setLoading(false);
      alert("Cuenta creada. Cuando el backend esté listo, esto quedará guardado de verdad. Por ahora, inicia sesión con un usuario de prueba.");
      router.push(ROUTES.LOGIN);
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Nombre completo
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre y apellido"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
            errors.nombre ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
          }`}
        />
        {errors.nombre && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.nombre}</p>}
      </div>

      <div>
        <label htmlFor="usuario" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Usuario
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          value={form.usuario}
          onChange={handleChange}
          placeholder="Elige un usuario"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
            errors.usuario ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
          }`}
        />
        {errors.usuario && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.usuario}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
            errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
          }`}
        />
        {errors.password && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmarPassword" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Confirmar contraseña
        </label>
        <input
          id="confirmarPassword"
          name="confirmarPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmarPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
            errors.confirmarPassword ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
          }`}
        />
        {errors.confirmarPassword && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.confirmarPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}