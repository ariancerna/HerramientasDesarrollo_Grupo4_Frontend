"use client";

import { FormEvent, useState } from "react";
import IndicadoresAsistenciaPanel from "@/components/reportes/indicadores-asistencia";
import AsistenciaTabla from "@/components/shared/asistencia-tabla";
import { RoleGuard } from "@/components/shared/role-guard";
import { descargarCsvReporteAsistencia } from "@/lib/exportar-reporte-asistencia";
import { NOMBRES_CATEGORIAS } from "@/lib/mock/categorias.mock";
import {
  FILTROS_REPORTE_INICIALES,
  FiltrosReporteAsistencia,
  calcularIndicadoresAsistencia,
  generarReporteAsistencia,
  validarPeriodoReporte,
} from "@/lib/reportes-asistencia";
import { obtenerRegistrosAsistencia } from "@/store/asistencia-store";
import type { RegistroAsistencia } from "@/types/asistencia";

export default function ReportesPage() {
  const [filtros, setFiltros] = useState<FiltrosReporteAsistencia>({
    ...FILTROS_REPORTE_INICIALES,
  });
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosReporteAsistencia | null>(null);
  const [registros, setRegistros] = useState<RegistroAsistencia[] | null>(null);
  const [error, setError] = useState("");
  const [mensajeExportacion, setMensajeExportacion] = useState("");
  const indicadores = registros
    ? calcularIndicadoresAsistencia(registros)
    : null;

  const actualizarFiltro = <K extends keyof FiltrosReporteAsistencia>(
    campo: K,
    valor: FiltrosReporteAsistencia[K],
  ) => {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
    setError("");
  };

  const generar = (filtrosAUsar: FiltrosReporteAsistencia) => {
    const mensajeError = validarPeriodoReporte(filtrosAUsar);

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    const nuevosRegistros = generarReporteAsistencia(
      obtenerRegistrosAsistencia(),
      filtrosAUsar,
    );
    setRegistros(nuevosRegistros);
    setFiltrosAplicados({ ...filtrosAUsar });
    setError("");
    setMensajeExportacion("");
  };

  const handleGenerar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    generar(filtros);
  };

  const handleCategoriaDesdeGrafico = (categoria: string) => {
    const nuevosFiltros = { ...filtros, categoria };
    setFiltros(nuevosFiltros);
    generar(nuevosFiltros);
  };

  const handleLimpiar = () => {
    setFiltros({ ...FILTROS_REPORTE_INICIALES });
    setFiltrosAplicados(null);
    setRegistros(null);
    setError("");
    setMensajeExportacion("");
  };

  const handleExportar = () => {
    if (!registros || registros.length === 0) return;

    descargarCsvReporteAsistencia(registros);
    setMensajeExportacion(
      `Se exportaron ${registros.length} registro${registros.length === 1 ? "" : "s"} correctamente.`,
    );
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Reportes de asistencia
          </h1>
        </header>

        <form
          onSubmit={handleGenerar}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
              <FilterIcon />
            </span>
            <h2 className="font-extrabold text-navy dark:text-white">Configurar reporte</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CampoFiltro etiqueta="Desde">
              <input
                type="date"
                value={filtros.fechaDesde}
                max={filtros.fechaHasta || undefined}
                onChange={(event) =>
                  actualizarFiltro("fechaDesde", event.target.value)
                }
                className={INPUT_CLASS}
              />
            </CampoFiltro>

            <CampoFiltro etiqueta="Hasta">
              <input
                type="date"
                value={filtros.fechaHasta}
                min={filtros.fechaDesde || undefined}
                onChange={(event) =>
                  actualizarFiltro("fechaHasta", event.target.value)
                }
                className={INPUT_CLASS}
              />
            </CampoFiltro>

            <CampoFiltro etiqueta="Categoría">
              <select
                value={filtros.categoria}
                onChange={(event) =>
                  actualizarFiltro("categoria", event.target.value)
                }
                className={INPUT_CLASS}
              >
                <option value="todas">Todas las categorías</option>
                {NOMBRES_CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </CampoFiltro>

            <CampoFiltro etiqueta="Método">
              <select
                value={filtros.metodo}
                onChange={(event) =>
                  actualizarFiltro(
                    "metodo",
                    event.target.value as FiltrosReporteAsistencia["metodo"],
                  )
                }
                className={INPUT_CLASS}
              >
                <option value="todos">Todos los métodos</option>
                <option value="ESCANEO">Escaneo</option>
                <option value="MANUAL">Manual</option>
              </select>
            </CampoFiltro>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleLimpiar}
              className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Limpiar filtros
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-green-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-lime focus:ring-offset-2"
            >
              <ChartIcon />
              Generar reporte
            </button>
          </div>
        </form>

        <section className="mt-7" aria-live="polite" aria-labelledby="resultado-title">
          {registros === null ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
                <ChartIcon />
              </span>
              <h2 className="mt-4 font-extrabold text-slate-800 dark:text-slate-200">Reporte pendiente</h2>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Selecciona los filtros que necesites y genera el reporte para consultar los registros.
              </p>
            </div>
          ) : (
            <>
              {indicadores && (
                <IndicadoresAsistenciaPanel
                  indicadores={indicadores}
                  onCategoriaSeleccionada={handleCategoriaDesdeGrafico}
                />
              )}
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <h2 id="resultado-title" className="text-xl font-extrabold text-navy dark:text-white">
                    Resultado
                  </h2>
                  <span className="rounded-full bg-brand-green-soft px-3 py-1 text-sm font-extrabold text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
                    {registros.length}
                  </span>
                  {filtrosAplicados && <ResumenFiltros filtros={filtrosAplicados} />}
                </div>
                <button
                  type="button"
                  onClick={handleExportar}
                  disabled={registros.length === 0}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-green-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-lime focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
                >
                  <DownloadIcon />
                  Exportar CSV
                </button>
              </div>
              {mensajeExportacion && (
                <p
                  role="status"
                  className="mb-4 rounded-lg border border-brand-green/20 bg-brand-green-soft px-4 py-3 text-sm font-medium text-brand-green dark:border-brand-green/30 dark:bg-brand-green/10 dark:text-brand-lime-light"
                >
                  {mensajeExportacion}
                </p>
              )}
              <AsistenciaTabla registros={registros} />
            </>
          )}
        </section>
      </div>
    </RoleGuard>
  );
}

const INPUT_CLASS =
  "w-full min-w-0 max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

function CampoFiltro({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {etiqueta}
      </span>
      {children}
    </label>
  );
}

function ResumenFiltros({ filtros }: { filtros: FiltrosReporteAsistencia }) {
  const partes = [
    filtros.fechaDesde ? `Desde ${formatearFecha(filtros.fechaDesde)}` : null,
    filtros.fechaHasta ? `Hasta ${formatearFecha(filtros.fechaHasta)}` : null,
    filtros.categoria !== "todas" ? filtros.categoria : null,
    filtros.metodo !== "todos"
      ? filtros.metodo === "ESCANEO"
        ? "Escaneo"
        : "Manual"
      : null,
  ].filter(Boolean);

  if (partes.length === 0) return null;

  return (
    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {partes.join(" · ")}
    </span>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(
    new Date(`${fecha}T12:00:00`),
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}