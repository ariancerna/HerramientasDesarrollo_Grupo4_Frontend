"use client";

import { FormEvent, useMemo, useState } from "react";
import IndicadoresAsistenciaPanel from "@/components/reportes/indicadores-asistencia";
import AsistenciaTabla from "@/components/shared/asistencia-tabla";
import { RoleGuard } from "@/components/shared/role-guard";
import { Button } from "@/components/ui/button";
import { CONTROL_CLASS } from "@/components/ui/control-styles";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast-provider";
import { descargarCsvReporteAsistencia } from "@/lib/exportar-reporte-asistencia";
import { NOMBRES_CATEGORIAS } from "@/lib/mock/categorias.mock";
import {
  FILTROS_REPORTE_INICIALES,
  FiltrosReporteAsistencia,
  PeriodoRapido,
  OrdenReporte,
  calcularIndicadoresAsistencia,
  generarReporteAsistencia,
  obtenerPeriodoRapido,
  procesarResultadosReporte,
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
  const [busquedaResultados, setBusquedaResultados] = useState("");
  const [ordenResultados, setOrdenResultados] =
    useState<OrdenReporte>("fecha-desc");
  const [pagina, setPagina] = useState(1);
  const [tamanoPagina, setTamanoPagina] = useState(10);
  const { notify } = useToast();
  const indicadores = registros
    ? calcularIndicadoresAsistencia(registros)
    : null;
  const resultadosVisibles = useMemo(
    () =>
      registros
        ? procesarResultadosReporte(
            registros,
            busquedaResultados,
            ordenResultados,
          )
        : [],
    [busquedaResultados, ordenResultados, registros],
  );
  const resultadosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * tamanoPagina;
    return resultadosVisibles.slice(inicio, inicio + tamanoPagina);
  }, [pagina, resultadosVisibles, tamanoPagina]);

  const actualizarFiltro = <K extends keyof FiltrosReporteAsistencia>(
    campo: K,
    valor: FiltrosReporteAsistencia[K],
  ) => {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
    setError("");
  };

  const handleGenerar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mensajeError = validarPeriodoReporte(filtros);

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    const nuevosRegistros = generarReporteAsistencia(
      obtenerRegistrosAsistencia(),
      filtros,
    );
    setRegistros(nuevosRegistros);
    setFiltrosAplicados({ ...filtros });
    setError("");
    setBusquedaResultados("");
    setOrdenResultados("fecha-desc");
    setPagina(1);
  };

  const aplicarPeriodoRapido = (periodo: PeriodoRapido) => {
    setFiltros((actuales) => ({
      ...actuales,
      ...obtenerPeriodoRapido(periodo),
    }));
    setError("");
    setBusquedaResultados("");
    setOrdenResultados("fecha-desc");
    setPagina(1);
  };

  const handleLimpiar = () => {
    setFiltros({ ...FILTROS_REPORTE_INICIALES });
    setFiltrosAplicados(null);
    setRegistros(null);
    setError("");
    setBusquedaResultados("");
    setOrdenResultados("fecha-desc");
    setPagina(1);
  };

  const handleExportar = () => {
    if (resultadosVisibles.length === 0) return;

    descargarCsvReporteAsistencia(resultadosVisibles);
    notify({
      title: "Reporte exportado",
      description: `Se exportaron ${resultadosVisibles.length} registro${resultadosVisibles.length === 1 ? "" : "s"} correctamente.`,
    });
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">
            ADMINISTRACIÓN
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Reportes de asistencia
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Consulta la participación del club por periodo, categoría y método de registro.
          </p>
        </header>

        <form
          onSubmit={handleGenerar}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="mb-4 flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400">
              <FilterIcon />
            </span>
            <div>
              <h2 className="font-bold text-ink dark:text-white">Configurar reporte</h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Deja los campos sin seleccionar para incluir todos los registros.
              </p>
            </div>
          </div>

          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Periodos rápidos
            </legend>
            <div className="flex flex-wrap gap-2">
              {PERIODOS_RAPIDOS.map((periodo) => (
                <button
                  key={periodo.value}
                  type="button"
                  onClick={() => aplicarPeriodoRapido(periodo.value)}
                  className="min-h-9 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary hover:bg-primary-soft hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  {periodo.label}
                </button>
              ))}
            </div>
          </fieldset>

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
            <Button
              type="button"
              onClick={handleLimpiar}
              variant="secondary"
            >
              Limpiar filtros
            </Button>
            <Button
              type="submit"
              className="px-5"
            >
              <ChartIcon />
              Generar reporte
            </Button>
          </div>
        </form>

        <section className="mt-7" aria-live="polite" aria-labelledby="resultado-title">
          {registros === null ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
                <ChartIcon />
              </span>
              <h2 className="mt-4 font-bold text-slate-800 dark:text-slate-200">Reporte pendiente</h2>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Selecciona los filtros que necesites y genera el reporte para consultar los registros.
              </p>
            </div>
          ) : (
            <>
              {indicadores && (
                <IndicadoresAsistenciaPanel indicadores={indicadores} />
              )}
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-dark">RESULTADO</p>
                  <h2 id="resultado-title" className="mt-0.5 text-xl font-bold text-ink dark:text-white">
                    {resultadosVisibles.length} de {registros.length} registro{registros.length === 1 ? "" : "s"}
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {filtrosAplicados && <ResumenFiltros filtros={filtrosAplicados} />}
                  <Button
                    type="button"
                    onClick={handleExportar}
                    disabled={resultadosVisibles.length === 0}
                    variant="secondary"
                    className="shrink-0 border-primary text-primary-dark hover:bg-primary-soft disabled:border-slate-300 disabled:text-slate-400 dark:disabled:border-slate-700 dark:disabled:text-slate-600"
                  >
                    <DownloadIcon />
                    Exportar CSV
                  </Button>
                </div>
              </div>
              <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Buscar en resultados
                  </span>
                  <input
                    type="search"
                    value={busquedaResultados}
                    onChange={(event) => {
                      setBusquedaResultados(event.target.value);
                      setPagina(1);
                    }}
                    placeholder="Nombre, DNI o categoría"
                    className={CONTROL_CLASS}
                  />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Ordenar por
                  </span>
                  <select
                    value={ordenResultados}
                    onChange={(event) =>
                      {
                        setOrdenResultados(event.target.value as OrdenReporte);
                        setPagina(1);
                      }
                    }
                    className={CONTROL_CLASS}
                  >
                    <option value="fecha-desc">Fecha más reciente</option>
                    <option value="fecha-asc">Fecha más antigua</option>
                    <option value="nombre-asc">Nombre del estudiante</option>
                    <option value="categoria-asc">Categoría</option>
                  </select>
                </label>
              </div>
              <AsistenciaTabla registros={resultadosPaginados} />
              <Pagination
                page={pagina}
                pageSize={tamanoPagina}
                totalItems={resultadosVisibles.length}
                onPageChange={setPagina}
                onPageSizeChange={(size) => {
                  setTamanoPagina(size);
                  setPagina(1);
                }}
              />
            </>
          )}
        </section>
      </div>
    </RoleGuard>
  );
}

const INPUT_CLASS = CONTROL_CLASS;

const PERIODOS_RAPIDOS: { value: PeriodoRapido; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
  { value: "ultimos-30-dias", label: "Últimos 30 días" },
];

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

  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      {partes.length > 0 ? partes.join(" · ") : "Todos los registros"}
    </p>
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
