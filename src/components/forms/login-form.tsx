"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME_ROUTE } from "@/constants/roles";

const RESEND_COOLDOWN_SECONDS = 30;

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

  // -----------------------------------------------------------
  // RECUPERAR CONTRASEÑA — panel dentro del mismo login (no navega)
  // -----------------------------------------------------------
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [codigoError, setCodigoError] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [verificado, setVerificado] = useState(false);
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const [verificandoCodigo, setVerificandoCodigo] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  function resetRecuperar() {
    setMostrarRecuperar(false);
    setCorreo("");
    setCodigo("");
    setCorreoError("");
    setCodigoError("");
    setCodigoEnviado(false);
    setVerificado(false);
    setCooldown(0);
  }

  function enviarCodigo() {
    if (!correo.trim() || !correo.includes("@")) {
      setCorreoError("Ingresa un correo válido.");
      return;
    }

    setCorreoError("");
    setEnviandoCodigo(true);

    /*
     * Aquí posteriormente puedes conectar
     * el envío real del código mediante tu API.
     */

    setTimeout(() => {
      setEnviandoCodigo(false);
      setCodigoEnviado(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }, 700);
  }

  function handleSubmitRecuperar(event: FormEvent) {
    event.preventDefault();

    if (!codigoEnviado) {
      enviarCodigo();
      return;
    }

    if (codigo.length !== 6) {
      setCodigoError("Ingresa el código de 6 dígitos.");
      return;
    }

    setCodigoError("");
    setVerificandoCodigo(true);

    /*
     * Aquí posteriormente puedes conectar
     * la validación real del código.
     */

    setTimeout(() => {
      setVerificandoCodigo(false);
      setVerificado(true);
    }, 700);
  }

  // -----------------------------------------------------------
  // LOGIN — sin cambios de lógica
  // -----------------------------------------------------------
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await login(form);

      if (!result.ok) {
        setSubmitError(result.error ?? "No se pudo iniciar sesión.");
        return;
      }

      if (result.rol) {
        router.push(ROLE_HOME_ROUTE[result.rol]);
      }
    } catch {
      setSubmitError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
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
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              errors.usuario ? "border-red-400" : "border-slate-200"
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
              errors.password ? "border-red-400" : "border-slate-200"
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <EyeIcon open={showPassword} className="h-5 w-5" />
          </button>
        </div>

        {errors.password && (
          <p className="-mt-2 text-xs font-medium text-red-500">
            {errors.password}
          </p>
        )}

        {/* OLVIDASTE CONTRASEÑA — ahora abre el panel, no navega */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => setMostrarRecuperar((v) => !v)}
            className="text-sm font-semibold text-primary transition hover:opacity-80"
          >
            {mostrarRecuperar ? "Cerrar" : "¿Olvidaste tu contraseña?"}
          </button>
        </div>

        {/* BOTÓN LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-[0_5px_18px_rgba(0,143,60,0.30)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{loading ? "Ingresando..." : "Iniciar sesión"}</span>
          {!loading && <ArrowIcon className="h-5 w-5" />}
        </button>
      </form>

      {/* ========================================================
          RECUPERAR CONTRASEÑA — panel inline (no es otra pantalla)
      ======================================================== */}
      {mostrarRecuperar && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recuperar contraseña
              </h3>
              {!codigoEnviado && !verificado && (
                <p className="mt-0.5 text-xs text-slate-500">
                  Recibirás un código temporal en tu correo.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={resetRecuperar}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Cerrar recuperar contraseña"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {verificado ? (
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-600">
                <CheckIcon className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Código verificado
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Ya puedes continuar con la recuperación de tu contraseña.
              </p>
              <button
                type="button"
                onClick={resetRecuperar}
                className="mt-4 h-10 w-full rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-primary-hover"
              >
                Continuar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRecuperar} noValidate className="space-y-3">
              {/* CORREO */}
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  autoComplete="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    setCorreoError("");
                  }}
                  placeholder="tucorreo@ejemplo.com"
                  disabled={codigoEnviado}
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:bg-slate-100 disabled:text-slate-500 ${
                    correoError ? "border-red-400" : "border-slate-200"
                  }`}
                />
              </div>
              {correoError && (
                <p className="text-xs font-medium text-red-500">{correoError}</p>
              )}

              {/* CÓDIGO */}
              {codigoEnviado && (
                <>
                  <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                    Te enviamos un código de 6 dígitos si el correo existe en
                    el sistema.
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={codigo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setCodigo(value);
                        setCodigoError("");
                      }
                    }}
                    placeholder="000000"
                    className={`h-12 w-full rounded-lg border bg-white text-center text-lg font-bold tracking-[0.4em] text-slate-900 outline-none transition placeholder:text-slate-300 placeholder:tracking-[0.4em] focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                      codigoError ? "border-red-400" : "border-slate-200"
                    }`}
                  />
                  {codigoError && (
                    <p className="text-xs font-medium text-red-500">
                      {codigoError}
                    </p>
                  )}
                </>
              )}

              {/* BOTONES */}
              <div className="flex gap-2 pt-1">
                {codigoEnviado && (
                  <button
                    type="button"
                    onClick={enviarCodigo}
                    disabled={cooldown > 0 || enviandoCodigo}
                    className="h-10 flex-1 rounded-lg border border-slate-300 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cooldown > 0 ? `Reenviar (${cooldown}s)` : "Reenviar"}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={enviandoCodigo || verificandoCodigo}
                  className={`h-10 rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 ${
                    codigoEnviado ? "flex-1" : "w-full"
                  }`}
                >
                  {enviandoCodigo
                    ? "Enviando..."
                    : verificandoCodigo
                      ? "Verificando..."
                      : codigoEnviado
                        ? "Verificar"
                        : "Enviar código"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================================
          SEPARADOR
      ======================================================== */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">O CONTINÚA CON</span>
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
      <path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.5" />
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
    <svg viewBox="0 0 24 24" fill="none" className={className}>
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

function MailIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m5 13 4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* GOOGLE */
function GoogleIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
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
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.54-4.71 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}