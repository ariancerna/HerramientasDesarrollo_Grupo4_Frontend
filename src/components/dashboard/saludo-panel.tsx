"use client";

import type { ReactNode } from "react";
import { formatearFechaLarga, saludoSegunHora } from "@/lib/formato";

interface SaludoPanelProps {
  nombre: string;
  descripcion: string;
  /** Acción principal del rol (por ejemplo, "Registrar asistencia"). */
  accion?: ReactNode;
}

/** Encabezado compacto de los paneles de inicio: saludo, fecha y acción principal. */
export function SaludoPanel({ nombre, descripcion, accion }: SaludoPanelProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{formatearFechaLarga(new Date())}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
          {saludoSegunHora()}, {nombre}
        </h1>
        <p className="mt-1 text-sm text-body">{descripcion}</p>
      </div>
      {accion && <div className="shrink-0">{accion}</div>}
    </header>
  );
}
