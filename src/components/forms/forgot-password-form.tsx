"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

const RESEND_COOLDOWN_SECONDS = 30;

export function ForgotPasswordForm() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setCorreo(event.target.value);
    setError("");
  }

  function enviarSolicitud() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }, 500);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!correo.trim() || !correo.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }
    enviarSolicitud();
  }

  function handleReenviar() {
    if (cooldown > 0 || loading) return;
    enviarSolicitud();
  }

  if (enviado) {
    return (
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
          <CheckIcon />
        </div>
        <p className="mt-4 text-base font-bold text-ink">Solicitud enviada</p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-body">
          Si <span className="font-semibold text-ink">{correo}</span> está registrado, enviaremos
          las instrucciones cuando el sistema esté conectado a un servicio de correo.
        </p>

        <button
          type="button"
          onClick={handleReenviar}
          disabled={cooldown > 0 || loading}
          className="mt-6 text-sm font-bold text-primary-dark transition hover:text-primary-hover disabled:cursor-not-allowed disabled:text-muted"
        >
          {cooldown > 0
            ? `Reenviar en ${cooldown}s`
            : loading
              ? "Reenviando..."
              : "Reenviar instrucciones"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            name="correo"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            className={`h-14 w-full rounded-xl border bg-bg-auth pl-12 pr-4 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 ${
              error ? "border-danger focus:border-danger focus:ring-danger/10" : "border-transparent"
            }`}
          />
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-14 w-full rounded-xl bg-primary text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.28)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Enviar instrucciones"}
      </button>
    </form>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
