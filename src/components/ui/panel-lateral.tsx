"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PanelLateralProps {
  abierto: boolean;
  titulo: ReactNode;
  subtitulo?: ReactNode;
  onCerrar: () => void;
  children: ReactNode;
  /** Botones de acción fijos al pie del panel. */
  pie?: ReactNode;
}

/** Panel de detalle que se desliza desde la derecha (se cierra con Escape o clic fuera). */
export function PanelLateral({ abierto, titulo, subtitulo, onCerrar, children, pie }: PanelLateralProps) {
  useEffect(() => {
    if (!abierto) return;
    const alPresionarTecla = (event: KeyboardEvent) => event.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return createPortal(
    <div className="fixed inset-0 z-[55] flex justify-end bg-slate-950/40 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && onCerrar()}>
      <aside
        role="dialog"
        aria-modal="true"
        className="flex h-full w-full max-w-md animate-[deslizar_0.25s_ease-out] flex-col border-l border-line bg-surface shadow-[0_0_60px_-15px_rgb(7_13_26/0.5)]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-ink">{titulo}</h2>
            {subtitulo && <div className="mt-0.5 text-sm text-body">{subtitulo}</div>}
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar detalle" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {pie && <footer className="flex gap-2 border-t border-line px-6 py-4">{pie}</footer>}
      </aside>
    </div>,
    document.body,
  );
}

/** Fila de dato en el detalle: etiqueta pequeña y valor. */
export function DatoDetalle({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm text-body">{etiqueta}</dt>
      <dd className="text-right text-sm font-semibold text-ink">{valor}</dd>
    </div>
  );
}
