import { HorarioAsignado, NOMBRES_DIAS } from "@/types/horario";
import { formatearRangoHoras } from "@/lib/formato";
import { InsigniaEstado } from "@/components/ui/insignia-estado";

interface HorarioCardProps {
  horario: HorarioAsignado;
}

export default function HorarioCard({ horario }: HorarioCardProps) {
  const estaActivo = horario.estado === "activo";

  return (
    <article className={`rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${
      estaActivo ? "border-slate-200 dark:border-slate-700" : "border-red-200 bg-red-50/30 dark:border-red-500/30 dark:bg-red-500/10"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-green">
            {NOMBRES_DIAS[horario.dia]}
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
            {horario.categoria}
          </h2>
        </div>
        <InsigniaEstado estado={estaActivo ? "activo" : "inactivo"} etiqueta={estaActivo ? "Activo" : "Cancelado"} />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {formatearRangoHoras(horario.horaInicio, horario.horaFin)}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {horario.cancha ?? "Cancha por confirmar"}
      </p>
    </article>
  );
}