"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME_ROUTE } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

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

  const [form, setForm] = useState<FormState>({
    usuario: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!form.usuario.trim()) {
      next.usuario = "El usuario es obligatorio.";
    }

    if (!form.password.trim()) {
      next.password = "La contraseña es obligatoria.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitError("");

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      const result = login(form);

      setLoading(false);

      if (!result.ok) {
        setSubmitError(
          result.error ?? "No se pudo iniciar sesión."
        );
        return;
      }

      if (result.rol) {
        router.push(ROLE_HOME_ROUTE[result.rol]);
      }
    }, 400);
  }

  return (
    <>
      {/* ERROR */}
      {submitError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {submitError}
        </div>
      )}

      {/* ========================================================
          LOGIN FORM
      ======================================================== */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {/* USUARIO */}
        <div className="relative">
          <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            value={form.usuario}
            onChange={handleChange}
            aria-invalid={Boolean(errors.usuario)}
            placeholder="Usuario o correo"
            className={`h-14 w-full rounded-xl border bg-white pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
              errors.usuario
                ? "border-red-400"
                : "border-slate-200"
            }`}
          />
        </div>

        {errors.usuario && (
          <p className="-mt-2 text-xs font-medium text-red-500">
            {errors.usuario}
          </p>
        )}

        {/* CONTRASEÑA */}
        <div className="relative">
          <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            placeholder="Contraseña"
            className={`h-14 w-full rounded-xl border bg-white pl-12 pr-12 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
              errors.password
                ? "border-red-400"
                : "border-slate-200"
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((value) => !value)
            }
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            <EyeIcon
              open={showPassword}
              className="h-5 w-5"
            />
          </button>
        </div>

        {errors.password && (
          <p className="-mt-2 text-xs font-medium text-red-500">
            {errors.password}
          </p>
        )}

        {/* OLVIDASTE CONTRASEÑA */}
        <div className="flex justify-end pt-1">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-semibold text-primary transition hover:opacity-80"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* BOTÓN LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-[0_5px_18px_rgba(0,143,60,0.30)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>
            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </span>

          {!loading && (
            <ArrowIcon className="h-5 w-5" />
          )}
        </button>
      </form>

      {/* ========================================================
          SEPARADOR
      ======================================================== */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-medium text-slate-400">
          O CONTINÚA CON
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* ========================================================
          GOOGLE
      ======================================================== */}
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <GoogleIcon className="h-5 w-5" />
        Continuar con Google
      </button>

      {/* ========================================================
          FACEBOOK
      ======================================================== */}
      <button
        type="button"
        className="mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <FacebookIcon className="h-5 w-5" />
        Continuar con Facebook
      </button>
    </>
  );
}

/* ===============================================================
   ICONOS
=============================================================== */

function UserIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="5"
        y="10.5"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M8 10.5V8a4 4 0 1 1 8 0v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EyeIcon({
  open,
  className,
}: {
  open: boolean;
  className: string;
}) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12z"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 3l18 18M10.6 10.7a2.5 2.5 0 0 0 3.6 3.5M6.6 6.8C4.5 8.1 3 12 3 12s3.5 6.5 9 6.5c1.6 0 3-.5 4.2-1.3M9.9 5.7A9.4 9.4 0 0 1 12 5.5c5.5 0 9 6.5 9 6.5a14 14 0 0 1-2.6 3.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
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

/* GOOGLE */
function GoogleIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.71-.06-1.39-.18-2.04H12v3.86h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.18Z"
      />

      <path
        fill="#34A853"
        d="M12 21.8c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.75 9.75 0 0 0 12 21.8Z"
      />

      <path
        fill="#FBBC05"
        d="M6.53 13.91A5.86 5.86 0 0 1 6.22 12c0-.66.11-1.3.31-1.91v-2.5H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.41l3.25-2.5Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.06c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.15 14.63 2.2 12 2.2a9.75 9.75 0 0 0-8.72 5.39l3.25 2.5C7.3 7.78 9.46 6.06 12 6.06Z"
      />
    </svg>
  );
}

/* FACEBOOK */
function FacebookIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.54-4.71 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}