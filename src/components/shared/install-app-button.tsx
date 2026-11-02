"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface EventoInstalacion extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Botón "Instalar app": aparece solo cuando el navegador permite instalar la PWA. */
export default function InstallAppButton() {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);

  useEffect(() => {
    const alPoderInstalar = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalacion);
    };
    const alInstalar = () => setEvento(null);
    window.addEventListener("beforeinstallprompt", alPoderInstalar);
    window.addEventListener("appinstalled", alInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", alPoderInstalar);
      window.removeEventListener("appinstalled", alInstalar);
    };
  }, []);

  if (!evento) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await evento.prompt();
        await evento.userChoice;
        setEvento(null);
      }}
      className="mr-1 hidden items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-surface-muted sm:inline-flex"
    >
      <Download className="h-3.5 w-3.5" /> Instalar app
    </button>
  );
}
