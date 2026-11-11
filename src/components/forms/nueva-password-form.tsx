"use client";

import { useState, type FormEvent } from "react";
import { api, mensajeError } from "@/lib/api";

interface NuevaPasswordFormProps {
  /** Token devuelto por POST /auth/password/verify. */
  resetToken: string;
  onCompletado: () => void;
}

/** Último paso de recuperar contraseña: guarda la nueva contraseña en el backend. */
export function NuevaPasswordForm({ resetToken, onCompletado }: NuevaPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password.trim() !== password) {
      setError("La contraseña no puede empezar ni terminar con espacios.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setGuardando(true);
    try {
      await api("/auth/password/reset", {
        method: "POST",
        body: { resetToken, nuevaPassword: password },
        auth: false,
      });
      setListo(true);
    } catch (err) {
      setError(mensajeError(err, "No se pudo actualizar la contraseña."));
    } finally {
      setGuardando(false);
    }
  }

  if (listo) {
    return (
      <div className="text-center">
        <p className="text-sm font-semibold text-ink">Contraseña actualizada</p>
        <p className="mt-1 text-xs text-body">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button
          type="button"
          onClick={onCompletado}
          className="mt-4 h-10 w-full rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3 text-left">
      <p className="text-sm font-semibold text-ink">Código verificado. Crea tu nueva contraseña.</p>
      <input
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
        aria-label="Nueva contraseña"
        className={inputClass}
      />
      <input
        type="password"
        autoComplete="new-password"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        placeholder="Confirmar contraseña"
        aria-label="Confirmar contraseña"
        className={inputClass}
      />
      <p className="text-xs text-muted">Mínimo 6 caracteres.</p>
      {error && <p role="alert" className="text-xs font-medium text-danger">{error}</p>}
      <button
        type="submit"
        disabled={guardando}
        className="h-10 w-full rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
      >
        {guardando ? "Guardando..." : "Guardar contraseña"}
      </button>
    </form>
  );
}
