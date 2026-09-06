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
  const [form, setForm] = useState<FormState>({ nombre: "", usuario: "", password: "", confirmarPassword: "" });
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
    setTimeout(() => {
      setLoading(false);
      alert("Cuenta creada. Cuando el backend esté listo, esto quedará guardado de verdad.");
      router.push(ROUTES.LOGIN);
    }, 500);
  }

  const inputClass = (hasError?: string) =>
    `h-12 w-full rounded-xl border bg-bg-auth px-4 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 ${
      hasError ? "border-danger focus:border-danger focus:ring-danger/10" : "border-transparent"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <input
          name="nombre"
          type="text"
          autoComplete="name"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre completo"
          className={inputClass(errors.nombre)}
        />
        {errors.nombre && <p className="mt-1.5 text-xs font-medium text-danger">{errors.nombre}</p>}
      </div>

      <div>
        <input
          name="usuario"
          type="text"
          autoComplete="username"
          value={form.usuario}
          onChange={handleChange}
          placeholder="Usuario"
          className={inputClass(errors.usuario)}
        />
        {errors.usuario && <p className="mt-1.5 text-xs font-medium text-danger">{errors.usuario}</p>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña (mínimo 6 caracteres)"
          className={inputClass(errors.password)}
        />
        {errors.password && <p className="mt-1.5 text-xs font-medium text-danger">{errors.password}</p>}
      </div>

      <div>
        <input
          name="confirmarPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmarPassword}
          onChange={handleChange}
          placeholder="Confirmar contraseña"
          className={inputClass(errors.confirmarPassword)}
        />
        {errors.confirmarPassword && <p className="mt-1.5 text-xs font-medium text-danger">{errors.confirmarPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-14 w-full rounded-xl bg-primary text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.28)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}