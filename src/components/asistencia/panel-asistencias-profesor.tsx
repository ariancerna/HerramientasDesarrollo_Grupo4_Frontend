"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { CheckCircle2, Clock3, RefreshCw, UserX, Users } from "lucide-react";
import { useCategoriasSesion } from "@/hooks/use-categorias-sesion";
import { horaEnLima, hoyEnLima } from "@/lib/fechas";
import { useAlumnos } from "@/store/alumnos-store";
import {
  asistenciasCargadas,
  fechaDeRegistro,
  recargarAsistencias,
  suscribirAsistencias,
  useRegistrosAsistencia,
} from "@/store/asistencia-store";

// Mientras se mira el día de hoy, se refresca cada cierto tiempo por si otro
// profesor registra desde otro equipo.
const REFRESCO_MS = 30_000;

const claseCampo =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

function fechaLegible(fecha: string) {
  // Mediodía en Lima para que el día no cambie por la zona horaria del equipo.
  const texto = new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${fecha}T12:00:00-05:00`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Panel de solo consulta para el profesor: quiénes ya registraron asistencia
 * en el día elegido y quiénes faltan, limitado a sus categorías.
 */
export function PanelAsistenciasProfesor() {
  const hoy = hoyEnLima();
  const [fecha, setFecha] = useState(hoy);
  const [categoria, setCategoria] = useState("todas");
  const [actualizando, setActualizando] = useState(false);

  const categoriasSesion = useCategoriasSesion();
  const misCategorias = useMemo(() => categoriasSesion ?? [], [categoriasSesion]);
  const registros = useRegistrosAsistencia();
  const alumnos = useAlumnos();
  const cargado = useSyncExternalStore(suscribirAsistencias, asistenciasCargadas, () => false);
  const esHoy = fecha === hoy;

  useEffect(() => {
    if (!esHoy) return;
    const intervalo = window.setInterval(() => {
      if (document.visibilityState === "visible") void recargarAsistencias();
    }, REFRESCO_MS);
    return () => window.clearInterval(intervalo);
  }, [esHoy]);

  // Categorías que se están mirando: todas las del profesor o solo la elegida.
  const alcance = useMemo(
    () => new Set(categoria === "todas" ? misCategorias : [categoria]),
    [categoria, misCategorias],
  );

  const registradas = useMemo(
    () =>
      registros
        .filter((registro) => fechaDeRegistro(registro) === fecha && alcance.has(registro.categoria))
        .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora)),
    [registros, fecha, alcance],
  );

  const faltan = useMemo(() => {
    const presentes = new Set(registradas.map((registro) => registro.estudianteId));
    return alumnos
      .filter((alumno) => alumno.estado === "activo" && alcance.has(alumno.categoria) && !presentes.has(alumno.id))
      .sort((a, b) => `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`, "es"));
  }, [alumnos, registradas, alcance]);

  const total = registradas.length + faltan.length;
  const porcentaje = total ? Math.round((registradas.length / total) * 100) : 0;

  async function actualizar() {
    setActualizando(true);
    try {
      await recargarAsistencias();
    } finally {
      setActualizando(false);
    }
  }

  if (categoriasSesion !== null && misCategorias.length === 0) {
    return (
      <section className="mt-8 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
        Aún no tienes categorías asignadas, así que no hay asistencias que mostrar.
      </section>
    );
  }

  return (
    <section aria-labelledby="panel-asistencias-title" className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="panel-asistencias-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            {esHoy ? "Asistencias de hoy" : "Asistencias del día"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{fechaLegible(fecha)}</p>
        </div>

        <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 sm:w-auto">
          <label className="min-w-0">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Fecha</span>
            <input
              type="date"
              value={fecha}
              max={hoy}
              onChange={(event) => {
                const valor = event.target.value;
                // Sin fecha o con una futura se vuelve a hoy: no hay asistencias del futuro.
                setFecha(!valor || valor > hoy ? hoy : valor);
              }}
              className={claseCampo}
            />
          </label>
          <label className="min-w-0">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Categoría</span>
            <select value={categoria} onChange={(event) => setCategoria(event.target.value)} className={claseCampo}>
              <option value="todas">Todas</option>
              {misCategorias.map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={actualizar}
            disabled={actualizando}
            aria-label="Actualizar asistencias"
            title="Actualizar"
            className="grid h-[38px] w-[38px] place-items-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 ${actualizando ? "animate-spin" : ""}`} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
          <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Users className="h-4 w-4 text-brand-green dark:text-brand-lime-light" aria-hidden />
            {cargado ? `${registradas.length} de ${total} alumnos registrados` : "Cargando asistencias..."}
          </p>
          {cargado && total > 0 && <p className="tabular-nums text-slate-600 dark:text-slate-400">{porcentaje}% de asistencia</p>}
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          aria-label="Porcentaje de asistencia"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={porcentaje}
        >
          <div className="h-full rounded-full bg-brand-green transition-[width] duration-500 dark:bg-brand-lime" style={{ width: `${porcentaje}%` }} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Lista
          titulo="Registrados"
          cantidad={registradas.length}
          icono={<CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />}
          vacio={cargado ? (esHoy ? "Todavía nadie registró asistencia hoy." : "No hubo registros ese día.") : "Cargando..."}
        >
          {registradas.map((registro) => (
            <li key={registro.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{registro.estudiante}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {registro.categoria || "Sin categoría"} · DNI {registro.dni}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    registro.metodo === "ESCANEO"
                      ? "bg-brand-green-soft text-brand-green dark:text-brand-lime-light"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                  }`}
                >
                  {registro.metodo === "ESCANEO" ? "Escaneo" : "Manual"}
                </span>
                <span className="flex items-center gap-1 text-xs tabular-nums text-slate-600 dark:text-slate-400">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden />
                  {horaEnLima(new Date(registro.fechaHora))}
                </span>
              </div>
            </li>
          ))}
        </Lista>

        <Lista
          titulo={esHoy ? "Faltan" : "Faltaron"}
          cantidad={faltan.length}
          icono={<UserX className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden />}
          vacio={cargado ? "Están todos tus alumnos activos." : "Cargando..."}
        >
          {faltan.map((alumno) => (
            <li key={alumno.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {alumno.nombres} {alumno.apellidos}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {alumno.categoria || "Sin categoría"} · DNI {alumno.dni}
                </p>
              </div>
            </li>
          ))}
        </Lista>
      </div>
    </section>
  );
}

function Lista({
  titulo,
  cantidad,
  icono,
  vacio,
  children,
}: {
  titulo: string;
  cantidad: number;
  icono: ReactNode;
  vacio: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
        <span className="flex items-center gap-2">
          {icono}
          {titulo}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {cantidad}
        </span>
      </h3>
      {cantidad === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">{vacio}</p>
      ) : (
        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">{children}</ul>
      )}
    </div>
  );
}
