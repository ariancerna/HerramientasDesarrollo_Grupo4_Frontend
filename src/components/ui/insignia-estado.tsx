type Estado = "activo" | "inactivo" | "pagado" | "pendiente" | "vencido" | "sin_cargo" | "borrador" | "enviado";

// Colores de estado con significado fijo en todo el sistema:
// verde = al día / activo, ámbar = pendiente, rojo = vencido / inactivo, gris = sin dato.
const ESTILOS: Record<Estado, { etiqueta: string; clase: string; punto: string }> = {
  activo: { etiqueta: "Activo", clase: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20", punto: "bg-emerald-500" },
  pagado: { etiqueta: "Pagado", clase: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20", punto: "bg-emerald-500" },
  enviado: { etiqueta: "Enviado", clase: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20", punto: "bg-emerald-500" },
  pendiente: { etiqueta: "Pendiente", clase: "bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20", punto: "bg-amber-500" },
  borrador: { etiqueta: "Borrador", clase: "bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20", punto: "bg-amber-500" },
  vencido: { etiqueta: "Vencido", clase: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20", punto: "bg-red-500" },
  inactivo: { etiqueta: "Inactivo", clase: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20", punto: "bg-red-500" },
  sin_cargo: { etiqueta: "Sin cargo", clase: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20", punto: "bg-slate-400" },
};

/** Insignia de estado con punto de color y texto (el color nunca va solo). */
export function InsigniaEstado({ estado, etiqueta }: { estado: Estado; etiqueta?: string }) {
  const estilo = ESTILOS[estado];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${estilo.clase}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${estilo.punto}`} aria-hidden="true" />
      {etiqueta ?? estilo.etiqueta}
    </span>
  );
}
