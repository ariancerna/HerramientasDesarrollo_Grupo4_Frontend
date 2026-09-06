import { DIAS_SEMANA, NOMBRES_DIAS } from "@/types/horario";

interface HorarioFiltrosProps {
  dia: string;
  onDiaChange: (dia: string) => void;
}

export default function HorarioFiltros({ dia, onDiaChange }: HorarioFiltrosProps) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      <span className="mr-2">Filtrar por día</span>
      <select
        value={dia}
        onChange={(event) => onDiaChange(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-800 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
      >
        <option value="todos">Todos los días</option>
        {DIAS_SEMANA.map((nombreDia) => (
          <option key={nombreDia} value={nombreDia}>
            {NOMBRES_DIAS[nombreDia]}
          </option>
        ))}
      </select>
    </label>
  );
}