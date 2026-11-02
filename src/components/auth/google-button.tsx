"use client";

import { useState } from "react";

/**
 * Acceso con Google. La autenticación con el proveedor la integra otro
 * integrante del equipo; mientras tanto el botón informa que aún no está activo.
 */
export function GoogleButton() {
  const [aviso, setAviso] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAviso(true)}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface text-[15px] font-semibold text-ink transition-colors hover:bg-surface-muted"
      >
        <GoogleIcon />
        Continuar con Google
      </button>
      {aviso && (
        <p role="status" className="mt-3 rounded-lg bg-primary-soft px-3.5 py-2.5 text-center text-[13px] text-primary dark:text-blue-200">
          El acceso con Google estará disponible próximamente. Por ahora ingresa con tu usuario y contraseña.
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
