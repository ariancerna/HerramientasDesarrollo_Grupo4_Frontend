"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useConfirm } from "@/hooks/use-confirm";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { confirm, dialog } = useConfirm();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  }

  function validate() {
    const next: FormErrors = {};

    if (!form.nombre.trim()) {
      next.nombre = "El nombre es obligatorio.";
    }

    if (!form.usuario.trim()) {
      next.usuario = "El usuario es obligatorio.";
    }

    if (form.password.length < 6) {
      next.password = "Mínimo 6 caracteres.";
    }

    if (form.confirmarPassword !== form.password) {
      next.confirmarPassword = "Las contraseñas no coinciden.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);

      await confirm({
        title: "Cuenta creada",
        message:
          "Cuando el backend esté listo, esto quedará guardado de verdad.",
        confirmLabel: "Entendido",
        hideCancel: true,
      });

      router.push(ROUTES.LOGIN);
    }, 500);
  }

  // Solo cálculos para MOSTRAR el medidor de fuerza; no cambian la validación.
  const tieneMinimo = form.password.length >= 6;
  const tieneLetra = /[a-zA-Z]/.test(form.password);
  const tieneNumero = /[0-9]/.test(form.password);

  const inputBase =
    "h-12 w-full rounded-xl border bg-bg-auth pl-11 pr-4 text-[14px] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary-soft";

  const inputClass = (hasError?: string) =>
    `${inputBase} ${
      hasError
        ? "border-danger focus:border-danger focus:ring-danger-light"
        : "border-border"
    }`;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* NOMBRE + USUARIO */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="nombre"
              className="mb-1.5 block text-sm font-semibold text-ink"
            >
              Nombre completo
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className={inputClass(errors.nombre)}
              />
            </div>
            {errors.nombre && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {errors.nombre}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="usuario"
              className="mb-1.5 block text-sm font-semibold text-ink"
            >
              Usuario
            </label>
            <div className="relative">
              <AtIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                value={form.usuario}
                onChange={handleChange}
                placeholder="usuario123"
                className={inputClass(errors.usuario)}
              />
            </div>
            {errors.usuario && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {errors.usuario}
              </p>
            )}
          </div>
        </div>

        {/* CONTRASEÑA */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Contraseña
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={`${inputClass(errors.password)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition hover:text-body"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-danger">
              {errors.password}
            </p>
          )}

          {/* MEDIDOR DE FUERZA */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            <StrengthHint label="Mínimo 6 caracteres" met={tieneMinimo} />
            <StrengthHint label="Incluye letras" met={tieneLetra} />
            <StrengthHint label="Incluye números" met={tieneNumero} />
          </div>
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div>
          <label
            htmlFor="confirmarPassword"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Confirmar contraseña
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              id="confirmarPassword"
              name="confirmarPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmarPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className={`${inputClass(errors.confirmarPassword)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition hover:text-body"
              aria-label={
                showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirmarPassword && (
            <p className="mt-1.5 text-xs font-medium text-danger">
              {errors.confirmarPassword}
            </p>
          )}
        </div>

        {/* BOTÓN CREAR CUENTA */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-bold text-white shadow-[0_5px_18px_rgba(30,58,138,0.28)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
          {!loading && <ArrowIcon />}
        </button>
      </form>

      {dialog}
    </>
  );
}

/* INDICADOR DE REQUISITO DE CONTRASEÑA */
function StrengthHint({ label, met }: { label: string; met: boolean }) {
  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-medium ${
        met ? "text-chart-win" : "text-muted"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          met
            ? "border-chart-win bg-chart-win text-white"
            : "border-border bg-white"
        }`}
      >
        {met && <CheckIcon />}
      </span>
      {label}
    </span>
  );
}

/* ICONOS */

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 19.5c1.1-3.6 3.5-5.5 7.5-5.5s6.4 1.9 7.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AtIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.2 4M6.3 6.3A15.3 15.3 0 0 0 2 12s3.6 7 10 7c1 0 1.9-.1 2.7-.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5" aria-hidden="true">
      <path
        d="m5 13 4 4L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}