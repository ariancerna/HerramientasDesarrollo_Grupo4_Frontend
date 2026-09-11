"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const RESEND_COOLDOWN_SECONDS = 30;

export function ForgotPasswordForm() {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");

  const [error, setError] = useState("");
  const [codigoError, setCodigoError] = useState("");

  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [verificado, setVerificado] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  function handleCorreoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setCorreo(event.target.value);
    setError("");
  }

  function handleCodigoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setCodigo(value);
      setCodigoError("");
    }
  }

  function enviarCodigo() {
    if (!correo.trim() || !correo.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }

    setError("");
    setLoading(true);

    /*
     * Aquí posteriormente puedes conectar
     * el envío real del código mediante tu API.
     */

    setTimeout(() => {
      setLoading(false);
      setCodigoEnviado(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }, 700);
  }

  function handleSubmit(event: FormEvent) {
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
    setVerificando(true);

    /*
     * Aquí posteriormente puedes conectar
     * la validación real del código.
     */

    setTimeout(() => {
      setVerificando(false);
      setVerificado(true);
    }, 700);
  }

  function handleReenviar() {
    if (cooldown > 0 || loading) return;

    enviarCodigo();
  }

  if (verificado) {
    return (
      <div className="text-center">

        {/* Icono */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dcfce7] text-[#16a34a]">
          <CheckIcon />
        </div>

        <h3 className="mt-5 text-lg font-extrabold text-[#111827]">
          Código verificado
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64748b]">
          El código fue verificado correctamente. Ya puedes continuar con
          la recuperación de tu contraseña.
        </p>

        <button
          type="button"
          className="mt-6 h-14 w-full rounded-xl bg-[#00a651] text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(0,143,60,0.28)] transition hover:bg-[#008f47]"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >

      {/* CORREO */}
      <div>
        <label
          htmlFor="correo"
          className="mb-2 block text-sm font-semibold text-[#334155]"
        >
          Correo electrónico
        </label>

        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />

          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={handleCorreoChange}
            placeholder="tucorreo@ejemplo.com"
            className={`h-14 w-full rounded-xl border bg-[#f8fafc] pl-12 pr-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#00a651] focus:bg-white focus:ring-4 focus:ring-[#00a651]/10 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-[#e2e8f0]"
            }`}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* CÓDIGO */}
      {codigoEnviado && (
        <div className="rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-4">

          <div className="mb-4">
            <label
              htmlFor="codigo"
              className="block text-sm font-bold text-[#166534]"
            >
              Código de verificación
            </label>

            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              Hemos enviado un código de 6 dígitos a:
            </p>

            <p className="mt-1 text-sm font-bold text-[#111827]">
              {correo}
            </p>
          </div>

          <div className="relative">
            <KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />

            <input
              id="codigo"
              name="codigo"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={codigo}
              onChange={handleCodigoChange}
              placeholder="Ingresa el código"
              className={`h-14 w-full rounded-xl border bg-white pl-12 pr-4 text-center text-[20px] font-bold tracking-[0.35em] text-[#111827] outline-none transition placeholder:text-[#94a3b8] placeholder:text-sm placeholder:tracking-normal focus:border-[#00a651] focus:ring-4 focus:ring-[#00a651]/10 ${
                codigoError
                  ? "border-red-500"
                  : "border-[#d1d5db]"
              }`}
            />
          </div>

          {codigoError && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {codigoError}
            </p>
          )}

          {/* Reenviar */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleReenviar}
              disabled={cooldown > 0 || loading}
              className="text-sm font-bold text-[#15803d] transition hover:text-[#0f6b32] disabled:cursor-not-allowed disabled:text-[#94a3b8]"
            >
              {cooldown > 0
                ? `Reenviar código en ${cooldown}s`
                : loading
                  ? "Enviando..."
                  : "¿No recibiste el código? Reenviar"}
            </button>
          </div>
        </div>
      )}

      {/* BOTÓN */}
      <button
        type="submit"
        disabled={loading || verificando}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#00a651] text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(0,143,60,0.28)] transition hover:bg-[#008f47] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading || verificando ? (
          <>
            <SpinnerIcon />

            {verificando
              ? "Verificando código..."
              : "Enviando código..."}
          </>
        ) : (
          <>
            {codigoEnviado
              ? "Verificar código"
              : "Enviar código"}

            <ArrowIcon />
          </>
        )}
      </button>

      {/* Mensaje */}
      {codigoEnviado && (
        <p className="text-center text-xs leading-5 text-[#94a3b8]">
          Revisa también tu carpeta de spam o correo no deseado.
        </p>
      )}
    </form>
  );
}

/* =========================
   ICONOS
========================= */

function MailIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="15"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m11 12 8-8m-3 3 2 2m-5 1 2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7"
      aria-hidden="true"
    >
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

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
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

function SpinnerIcon() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />

      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}