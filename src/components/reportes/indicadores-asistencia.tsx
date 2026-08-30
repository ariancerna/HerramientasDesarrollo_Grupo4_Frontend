import type {
  DistribucionAsistencia,
  IndicadoresAsistencia,
} from "@/lib/reportes-asistencia";

interface IndicadoresAsistenciaProps {
  indicadores: IndicadoresAsistencia;
}

export default function IndicadoresAsistenciaPanel({
  indicadores,
}: IndicadoresAsistenciaProps) {
  const actividadReciente = indicadores.porFecha.slice(-7);

  return (
    <section className="mb-7" aria-labelledby="indicadores-title">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#16794C]">INDICADORES</p>
        <h2 id="indicadores-title" className="mt-0.5 text-xl font-bold text-[#0A1628]">
          Resumen de asistencia
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Los resultados corresponden a los filtros aplicados al reporte.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador
          etiqueta="Asistencias"
          valor={indicadores.totalAsistencias.toLocaleString("es-PE")}
          ayuda="Registros encontrados"
          icono={<CheckIcon />}
        />
        <Indicador
          etiqueta="Alumnos únicos"
          valor={indicadores.estudiantesUnicos.toLocaleString("es-PE")}
          ayuda="Con al menos un registro"
          icono={<StudentsIcon />}
        />
        <Indicador
          etiqueta="Promedio por día"
          valor={indicadores.promedioPorDia.toLocaleString("es-PE", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          ayuda={`${indicadores.diasConActividad} día${indicadores.diasConActividad === 1 ? "" : "s"} con actividad`}
          icono={<CalendarIcon />}
        />
        <Indicador
          etiqueta="Registros por escaneo"
          valor={`${indicadores.porcentajeEscaneo.toLocaleString("es-PE", {
            maximumFractionDigits: 1,
          })}%`}
          ayuda="Del total de asistencias"
          icono={<ScanIcon />}
        />
      </dl>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <DistribucionCard
          titulo="Asistencia por categoría"
          descripcion="Participación dentro del resultado actual"
          datos={indicadores.porCategoria}
          formatearEtiqueta={(etiqueta) => etiqueta}
        />
        <DistribucionCard
          titulo="Actividad reciente"
          descripcion="Últimos 7 días con registros en el periodo"
          datos={actividadReciente}
          formatearEtiqueta={formatearFecha}
        />
      </div>
    </section>
  );
}

function Indicador({
  etiqueta,
  valor,
  ayuda,
  icono,
}: {
  etiqueta: string;
  valor: string;
  ayuda: string;
  icono: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <dt className="text-sm font-semibold text-slate-600">{etiqueta}</dt>
          <dd className="mt-2 text-3xl font-bold tracking-tight text-[#0A1628]">
            {valor}
          </dd>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#edf8e8] text-[#16794C]">
          {icono}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">{ayuda}</p>
    </div>
  );
}

function DistribucionCard({
  titulo,
  descripcion,
  datos,
  formatearEtiqueta,
}: {
  titulo: string;
  descripcion: string;
  datos: DistribucionAsistencia[];
  formatearEtiqueta: (etiqueta: string) => string;
}) {
  const maximo = Math.max(...datos.map((dato) => dato.cantidad), 1);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-[#0A1628]">{titulo}</h3>
      <p className="mt-0.5 text-sm text-slate-500">{descripcion}</p>

      {datos.length === 0 ? (
        <p className="mt-6 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No hay datos para mostrar.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {datos.map((dato) => (
            <li key={dato.etiqueta}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-slate-700">
                  {formatearEtiqueta(dato.etiqueta)}
                </span>
                <span className="font-bold text-[#0A1628]">{dato.cantidad}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#6FCF3A]"
                  style={{ width: `${(dato.cantidad / maximo) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fecha}T12:00:00`));
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

function CheckIcon() {
  return <Icon><path d="m5 12 4 4L19 6" /></Icon>;
}

function StudentsIcon() {
  return <Icon><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" /></Icon>;
}

function CalendarIcon() {
  return <Icon><path d="M7 3v3M17 3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="3" /></Icon>;
}

function ScanIcon() {
  return <Icon><path d="M8 4H5a1 1 0 0 0-1 1v3M16 4h3a1 1 0 0 1 1 1v3M8 20H5a1 1 0 0 1-1-1v-3M16 20h3a1 1 0 0 0 1-1v-3M7 12h10" /></Icon>;
}
