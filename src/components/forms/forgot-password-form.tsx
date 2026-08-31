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
    // TODO: reemplazar por la llamada real al backend cuando esté disponible (Sprint 2).
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
    }, 500);
  }

  if (enviado) {
    return (
      <div className="rounded-lg border border-primary-light bg-primary-soft px-4 py-5 text-center">
        <p className="text-sm font-semibold text-primary-dark">Solicitud enviada</p>
        <p className="mt-1.5 text-sm text-body">
          Si <span className="font-medium text-ink">{correo}</span> está registrado, enviaremos
          las instrucciones para restablecer la contraseña en cuanto el sistema esté conectado a
          un servicio de correo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="correo" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Correo electrónico
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={handleChange}
          placeholder="tucorreo@ejemplo.com"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
          }`}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Enviar instrucciones"}
      </button>
    </form>
  );
}