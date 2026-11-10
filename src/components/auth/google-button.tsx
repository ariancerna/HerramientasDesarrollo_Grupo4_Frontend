"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { api, mensajeError } from "@/lib/api";
import { ROUTES } from "@/constants/routes";

/**
 * Acceso con Google (Supabase Auth). Pide al backend la URL de autorización y
 * redirige a Google; al volver, /auth/callback completa el inicio de sesión.
 */
export function GoogleButton() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function continuarConGoogle() {
    setError("");
    setCargando(true);
    try {
      const redirectTo = `${window.location.origin}${ROUTES.AUTH_CALLBACK}`;
      const { url } = await api<{ url: string }>(
        `/auth/google/url?redirectTo=${encodeURIComponent(redirectTo)}`,
        { auth: false },
      );
      window.location.assign(url);
    } catch (e) {
      setError(mensajeError(e, "No se pudo iniciar el acceso con Google."));
      setCargando(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={continuarConGoogle}
        disabled={cargando}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface text-[15px] font-semibold text-ink transition-colors hover:bg-surface-muted disabled:cursor-wait disabled:opacity-70"
      >
        {cargando ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <GoogleIcon />}
        {cargando ? "Redirigiendo a Google…" : "Continuar con Google"}
      </button>
      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-danger/30 bg-danger-light px-3.5 py-2.5 text-center text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.73Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.76c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.87 8.87 4.76 12 4.76Z" />
    </svg>
  );
}
