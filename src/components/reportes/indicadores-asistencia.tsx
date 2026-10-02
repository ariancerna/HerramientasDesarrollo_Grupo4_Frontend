import type {
  DistribucionAsistencia,
  IndicadoresAsistencia,
} from "@/lib/reportes-asistencia";

interface IndicadoresAsistenciaProps {
  indicadores: IndicadoresAsistencia;
  onCategoriaSeleccionada?: (categoria: string) => void;
}

export default function IndicadoresAsistenciaPanel({
  indicadores,
  onCategoriaSeleccionada,
}: IndicadoresAsistenciaProps) {
  const actividadReciente = indicadores.porFecha.slice(-7);

  return (
    <section className="mb-7" aria-labelledby="indicadores-title">
      <h2 id="indicadores-title" className="mb-4 text-xl font-extrabold tracking-tight text-navy dark:text-white">
        Resumen de asistencia
      </h2>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador
          etiqueta="Asistencias"
          valor={indicadores.totalAsistencias.toLocaleString("es-PE")}
          icono={<CheckIcon />}
        />
        <Indicador
          etiqueta="Alumnos únicos"
          valor={indicadores.estudiantesUnicos.toLocaleString("es-PE")}
          icono={<StudentsIcon />}
        />
        <Indicador
          etiqueta="Promedio por día"
          valor={indicadores.promedioPorDia.toLocaleString("es-PE", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          icono={<CalendarIcon />}
        />
        <Indicador
          etiqueta="Registros por escaneo"
          valor={`${indicadores.porcentajeEscaneo.toLocaleString("es-PE", {
            maximumFractionDigits: 1,
          })}%`}
          icono={<ScanIcon />}
        />
      </dl>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <DistribucionCard
          titulo="Asistencia por categoría"
          datos={indicadores.porCategoria}
          formatearEtiqueta={(etiqueta) => etiqueta}
          onBarraClick={onCategoriaSeleccionada}
        />
        <DistribucionCard
          titulo="Actividad reciente"
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
  icono,
}: {
  etiqueta: string;
  valor: string;
  icono: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <dt className="text-sm font-semibold text-slate-600 dark:text-slate-300">{etiqueta}</dt>
          <dd className="mt-2 text-3xl font-extrabold tracking-tight text-navy dark:text-white">
            {valor}
          </dd>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
          {icono}
        </span>
      </div>
    </div>
  );
}

function DistribucionCard({
  titulo,
  datos,
  formatearEtiqueta,
  onBarraClick,
}: {
  titulo: string;
  datos: DistribucionAsistencia[];
  formatearEtiqueta: (etiqueta: string) => string;
  onBarraClick?: (etiqueta: string) => void;
}) {
  const maximo = Math.max(...datos.map((dato) => dato.cantidad), 1);
  const esClicable = Boolean(onBarraClick);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="font-extrabold text-navy dark:text-white">{titulo}</h3>

      {datos.length === 0 ? (
        <p className="mt-6 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          No hay datos para mostrar.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {datos.map((dato) => {
            const contenido = (
              <>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                    {formatearEtiqueta(dato.etiqueta)}
                  </span>
                  <span className="font-extrabold text-navy dark:text-white">{dato.cantidad}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-green transition-all"
                    style={{ width: `${(dato.cantidad / maximo) * 100}%` }}
                  />
                </div>
              </>
            );

            if (!esClicable) {
              return <li key={dato.etiqueta}>{contenido}</li>;
            }

            return (
              <li key={dato.etiqueta}>
                <button
                  type="button"
                  onClick={() => onBarraClick?.(dato.etiqueta)}
                  className="w-full rounded-lg p-1.5 text-left transition hover:bg-brand-green-soft dark:hover:bg-brand-green/10"
                  title={`Filtrar el reporte por "${dato.etiqueta}"`}
                >
                  {contenido}
                </button>
              </li>
            );
          })}
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