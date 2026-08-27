"use client";

// src/components/forms/login-form.tsx
// SCRUM-7 (US-01) Administrator Login

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME_ROUTE } from "@/constants/roles";

interface FormState {
  usuario: string;
  password: string;
}

interface FormErrors {
  usuario?: string;
  password?: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ usuario: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.usuario.trim()) next.usuario = "El usuario es obligatorio.";
    if (!form.password.trim()) next.password = "La contraseña es obligatoria.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setLoading(true);
    // Simula latencia, como si validara contra un servicio real.
    setTimeout(() => {
      const result = login(form);
      setLoading(false);

      if (!result.ok) {
        setSubmitError(result.error ?? "No se pudo iniciar sesión.");
        return;
      }
      router.push(ROLE_HOME_ROUTE[result.rol ?? "administrador"]);
    }, 400);
  }

  return (
    <>
      {submitError && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="usuario" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Usuario
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              value={form.usuario}
              onChange={handleChange}
              aria-invalid={Boolean(errors.usuario)}
              className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#16794C] focus:ring-4 focus:ring-[#16794C]/10 ${
                errors.usuario ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
              }`}
              placeholder="Ingresa tu usuario"
            />
          </div>
          {errors.usuario && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.usuario}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Contraseña
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              className={`h-11 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#16794C] focus:ring-4 focus:ring-[#16794C]/10 ${
                errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
              }`}
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16794C]/30"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <EyeIcon open={showPassword} className="h-[18px] w-[18px]" />
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-[#16794C] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#12613D] focus:outline-none focus:ring-4 focus:ring-[#16794C]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </>
  );
}

// --- Iconos SVG simples, sin dependencias externas ---

function UserIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10.5V8a4 4 0 118 0v2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeIcon({ open, className }: { open: boolean; className: string }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 3l18 18M10.6 10.7a2.5 2.5 0 003.6 3.5M6.6 6.8C4.5 8.1 3 12 3 12s3.5 6.5 9 6.5c1.6 0 3-.5 4.2-1.3M9.9 5.7A9.4 9.4 0 0112 5.5c5.5 0 9 6.5 9 6.5a14 14 0 01-2.6 3.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
