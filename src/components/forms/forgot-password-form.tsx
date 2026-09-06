"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

export function ForgotPasswordForm() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setCorreo(event.target.value);
    setError("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!correo.trim() || !correo.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
    }, 500);
  }

  if (enviado) {
    return (
      <div className="rounded-xl border border-primary-light bg-primary-soft px-4 py-5 text-center">
        <p className="text-sm font-semibold text-primary-dark">Solicitud enviada</p>
        <p className="mt-1.5 text-sm text-body">
          Si <span className="font-medium text-ink">{correo}</span> está registrado, enviaremos
          las instrucciones cuando el sistema esté conectado a un servicio de correo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <input
          name="correo"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={handleChange}
          placeholder="tucorreo@ejemplo.com"
          className={`h-14 w-full rounded-xl border bg-bg-auth px-4 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 ${
            error ? "border-danger focus:border-danger focus:ring-danger/10" : "border-transparent"
          }`}
        />
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