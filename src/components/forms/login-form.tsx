"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, LogIn, UserRound } from "lucide-react";

import { GoogleButton } from "@/components/auth/google-button";
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

export const claseCampo =
  "h-12 w-full rounded-xl border bg-surface pl-11 pr-4 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary-light focus:ring-4 focus:ring-primary-light/15";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ usuario: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  function validate() {
    const next: FormErrors = {};
    if (!form.usuario.trim()) next.usuario = "Ingresa tu usuario.";
    if (!form.password.trim()) next.password = "Ingresa tu contraseña.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    const result = await login(form);
    setLoading(false);

    if (!result.ok) {
      setSubmitError(result.error ?? "No se pudo iniciar sesión.");
      return;
    }
    if (result.rol) router.push(ROLE_HOME_ROUTE[result.rol]);
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="usuario" className="mb-1.5 block text-sm font-semibold text-ink">
            Usuario
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={form.usuario}
              onChange={handleChange}
              placeholder="Tu nombre de usuario"
              aria-invalid={Boolean(errors.usuario)}
              className={`${claseCampo} ${errors.usuario ? "border-danger" : "border-line"}`}
            />
          </div>
          {errors.usuario && <p className="mt-1.5 text-xs font-medium text-danger">{errors.usuario}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-ink">
              Contraseña
            </label>
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-[13px] font-medium text-primary-light hover:underline dark:text-blue-300">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              className={`${claseCampo} pr-12 ${errors.password ? "border-danger" : "border-line"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted transition-colors hover:text-ink"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs font-medium text-danger">{errors.password}</p>}
        </div>

        {submitError && (
          <div role="alert" className="rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm font-medium text-danger">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white shadow-[0_12px_24px_-12px_rgb(30_58_138/0.8)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-[18px] w-[18px] animate-spin" /> Ingresando…
            </>
          ) : (
            <>
              <LogIn className="h-[18px] w-[18px]" /> Ingresar
              <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-muted">o continúa con</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton />
    </>
  );
}
