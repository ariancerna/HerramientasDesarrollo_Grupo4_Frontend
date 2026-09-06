import { HorarioAsignado, NOMBRES_DIAS } from "@/types/horario";

interface HorarioCardProps {
  horario: HorarioAsignado;
}

export default function HorarioCard({ horario }: HorarioCardProps) {
  const estaActivo = horario.estado === "activo";

  return (
    <article className={`rounded-xl border bg-white p-5 shadow-sm ${
      estaActivo ? "border-slate-200" : "border-red-200 bg-red-50/30"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#16794C]">
            {NOMBRES_DIAS[horario.dia]}
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            {horario.categoria}
          </h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          estaActivo ? "bg-[#edf8e8] text-[#16794C]" : "bg-red-100 text-red-700"
        }`}>
          {estaActivo ? "Activo" : "Cancelado"}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {horario.horaInicio} - {horario.horaFin}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {horario.cancha ?? "Cancha por confirmar"}
      </p>
    </article>
  );
}