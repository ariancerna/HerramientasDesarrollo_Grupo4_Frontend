"use client";

import { useEffect, useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

type TipoAviso = "exito" | "error";

interface Aviso {
  id: number;
  tipo: TipoAviso;
  mensaje: string;
}

const EVENTO = "kickstamp:aviso";
const DURACION_MS = 3500;
let siguienteId = 1;

/** Muestra un aviso flotante (toast) desde cualquier parte de la aplicación. */
export function avisar(mensaje: string, tipo: TipoAviso = "exito") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Aviso>(EVENTO, { detail: { id: siguienteId++, tipo, mensaje } }));
}

/** Contenedor de avisos: esquina inferior derecha, se cierran solos o con la X. */
export function Toaster() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    const alRecibir = (event: Event) => {
      const aviso = (event as CustomEvent<Aviso>).detail;
      setAvisos((actuales) => [...actuales.slice(-3), aviso]);
      window.setTimeout(() => setAvisos((actuales) => actuales.filter((a) => a.id !== aviso.id)), DURACION_MS);
    };
    window.addEventListener(EVENTO, alRecibir);
    return () => window.removeEventListener(EVENTO, alRecibir);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6" aria-live="polite" role="status">
      {avisos.map((aviso) => {
        const Icono = aviso.tipo === "exito" ? CircleCheck : CircleAlert;
        return (
          <div
            key={aviso.id}
            className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-[0_16px_40px_-12px_rgb(15_27_51/0.35)]"
          >
            <Icono className={`mt-0.5 h-5 w-5 shrink-0 ${aviso.tipo === "exito" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
            <p className="flex-1 text-sm font-medium text-ink">{aviso.mensaje}</p>
            <button
              type="button"
              onClick={() => setAvisos((actuales) => actuales.filter((a) => a.id !== aviso.id))}
              aria-label="Cerrar aviso"
              className="rounded-md p-0.5 text-muted transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
