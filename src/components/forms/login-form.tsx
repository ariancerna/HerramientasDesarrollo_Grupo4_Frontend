"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME_ROUTE } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

interface FormState { usuario: string; password: string; }
interface FormErrors { usuario?: string; password?: string; }

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
    if (!form.usuario.trim()) next.usuario = "El usuario es obligatorio.";
    if (!form.password.trim()) next.password = "La contraseña es obligatoria.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(form);
      setLoading(false);
      if (!result.ok) { setSubmitError(result.error ?? "No se pudo iniciar sesión."); return; }
      if (result.rol) router.push(ROLE_HOME_ROUTE[result.rol]);
    }, 400);
  }

  return (
    <>
      {submitError && (
        <div role="alert" className="mb-5 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm font-medium text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="relative">
          <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            value={form.usuario}
            onChange={handleChange}
            aria-invalid={Boolean(errors.usuario)}
            placeholder="Usuario"
            className={`h-14 w-full rounded-xl border bg-bg-subtle pl-12 pr-4 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 ${
              errors.usuario ? "border-danger focus:border-danger focus:ring-danger/10" : "border-transparent"
            }`}
          />
        </div>
        {errors.usuario && <p className="-mt-2 text-xs font-medium text-danger">{errors.usuario}</p>}

        <div className="relative">
          <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            placeholder="Contraseña"
            className={`h-14 w-full rounded-xl border bg-bg-subtle pl-12 pr-12 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 ${
              errors.password ? "border-danger focus:border-danger focus:ring-danger/10" : "border-transparent"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-border/40 hover:text-body"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <EyeIcon open={showPassword} className="h-5 w-5" />
          </button>
        </div>
        {errors.password && <p className="-mt-2 text-xs font-medium text-danger">{errors.password}</p>}

        <div className="flex justify-end pt-1">
          <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm font-semibold text-primary-dark hover:text-primary-hover">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-14 w-full items-center justify-between rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(34,197,94,0.28)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{loading ? "Ingresando..." : "Iniciar sesión"}</span>
          {!loading && <ArrowIcon className="h-5 w-5" />}
        </button>
      </form>
    </>
  );
}

function UserIcon({ className }: { className: string }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className}><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" /><path d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function LockIcon({ className }: { className: string }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className}><rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
function EyeIcon({ open, className }: { open: boolean; className: string }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M3 3l18 18M10.6 10.7a2.5 2.5 0 0 0 3.6 3.5M6.6 6.8C4.5 8.1 3 12 3 12s3.5 6.5 9 6.5c1.6 0 3-.5 4.2-1.3M9.9 5.7A9.4 9.4 0 0 1 12 5.5c5.5 0 9 6.5 9 6.5a14 14 0 0 1-2.6 3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  );
}
function ArrowIcon({ className }: { className: string }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}