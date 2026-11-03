"use client";

import { useDatosRemotos } from "@/lib/remote-collection";
import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { CalendarDays, ClipboardCheck, UserPlus, Users, Wallet } from "lucide-react";
import { SaludoPanel } from "@/components/dashboard/saludo-panel";
import { Indicador } from "@/components/dashboard/indicador";
import { GraficoAsistencia } from "@/components/dashboard/grafico-asistencia";
import { EstadoPagos } from "@/components/dashboard/estado-pagos";
import { formatearDiaMes, formatearFechaCorta, formatearFechaHora as formatoFechaHora } from "@/lib/formato";
import { useAuth } from "@/hooks/use-auth";
import { alumnosCargados, obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerRegistrosAsistencia } from "@/store/asistencia-store";
import { obtenerProximasActividadesTodas } from "@/store/calendario-store";
import { formatearPeriodo, obtenerPagos } from "@/store/pagos-store";

export default function AdminDashboardPage() {
  useDatosRemotos();
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Administrador";
  const alumnos = obtenerAlumnos();
  const asistencias = obtenerRegistrosAsistencia();
  const pagos = obtenerPagos();
  const activos = alumnos.filter((alumno) => alumno.estado === "activo").length;
  const hoy = fechaLocal(new Date());
  const periodo = hoy.slice(0, 7);
  const datosListos = alumnosCargados();
  // Estado del mes de cada alumno activo: su cargo del período o "sin cargo".
  const estadoMes = { pagados: 0, pendientes: 0, vencidos: 0, sinCargo: 0 };
  for (const alumno of alumnos.filter((item) => item.estado === "activo")) {
    const pago = pagos.find((item) => item.estudianteId === alumno.id && item.periodo === periodo);
    if (!pago) estadoMes.sinCargo += 1;
    else if (pago.estado === "pagado") estadoMes.pagados += 1;
    else if (pago.estado === "vencido") estadoMes.vencidos += 1;
    else estadoMes.pendientes += 1;
  }
  const asistenciasHoy = asistencias.filter((registro) => fechaLocal(new Date(registro.fechaHora)) === hoy).length;
  const proximasActividades = obtenerProximasActividadesTodas(new Date(), 4);
  const proximaActividad = proximasActividades[0];
  const recientes = asistencias.slice(0, 5);

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div className="w-full max-w-full overflow-x-hidden px-1 sm:px-0">
        <SaludoPanel
          nombre={primerNombre}
          descripcion="Resumen de la operación del club."
          accion={
            <Link href="/dashboard/admin/alumnos" className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark">
              <UserPlus className="h-4 w-4" /> Nuevo alumno
            </Link>
          }
        />

        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4" aria-label="Indicadores">
          <Indicador etiqueta="Alumnos activos" valor={activos} detalle={`de ${alumnos.length} registrados`} icono={<Users className="h-5 w-5" />} tono="azul" cargando={!datosListos} />
          <Indicador etiqueta="Asistencias de hoy" valor={asistenciasHoy} detalle={formatearFechaCorta(new Date())} icono={<ClipboardCheck className="h-5 w-5" />} tono="verde" cargando={!datosListos} />
          <Indicador etiqueta="Pagos al día" valor={`${estadoMes.pagados}/${activos}`} detalle={`Mensualidad de ${formatearPeriodo(periodo)}`} icono={<Wallet className="h-5 w-5" />} tono="ambar" cargando={!datosListos} />
          <Indicador
            etiqueta="Próxima actividad"
            valor={proximaActividad ? formatearDiaMes(proximaActividad.fecha) : "Sin agenda"}
            detalle={proximaActividad ? (proximaActividad.tipo === "entrenamiento" ? proximaActividad.categoria ?? proximaActividad.titulo : proximaActividad.titulo) : undefined}
            icono={<CalendarDays className="h-5 w-5" />}
            tono="neutro"
            cargando={!datosListos}
          />
        </section>

        <section className="mt-4 grid gap-4 sm:mt-6 xl:grid-cols-[1.6fr_1fr]">
          <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-ink">Asistencia diaria</h2>
              <Link href="/dashboard/admin/reportes" className="text-xs font-semibold text-primary-light hover:underline dark:text-blue-300">Ver reportes</Link>
            </div>
            <GraficoAsistencia registros={asistencias.map((registro) => registro.fechaHora)} />
          </article>

          <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-ink">Mensualidades de {formatearPeriodo(periodo)}</h2>
              <Link href="/dashboard/admin/pagos" className="text-xs font-semibold text-primary-light hover:underline dark:text-blue-300">Ir a pagos</Link>
            </div>
            <EstadoPagos {...estadoMes} />
          </article>
        </section>

        {/* Tablas / Listas Responsivas (App Native Feel) */}
        <section className="mt-6 sm:mt-8 grid gap-4 xl:grid-cols-[1.35fr_0.9fr]" aria-label="Información operativa">
          {/* Últimos Registros */}
          <article className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            <PanelHeader title="Últimos registros" href="/dashboard/admin/asistencia" linkLabel="Ver todos" icon={<ClipboardListIcon />} />
            
            {recientes.length ? (
              <div className="p-3 sm:p-4">
                {/* VISTA MÓVIL (Cards tipo App Nativa) */}
                <div className="grid gap-2.5 sm:hidden">
                  {recientes.map((registro) => (
                    <div key={registro.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                      <div className="min-w-0 pr-2">
                        <p className="truncate text-xs font-bold text-navy dark:text-slate-100">{registro.estudiante}</p>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{registro.categoria}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{formatearFechaHora(registro.fechaHora)}</p>
                      </div>
                      <div className="shrink-0">
                        {registro.metodo === "ESCANEO" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            Escaneo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                            Manual
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* VISTA TABLET / DESKTOP (Tabla Resaltada) */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100/80 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-5 py-3.5 font-extrabold">Alumno</th>
                        <th className="px-5 py-3.5 font-extrabold">Registro</th>
                        <th className="px-5 py-3.5 font-extrabold">Fecha y hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {recientes.map((registro) => (
                        <tr key={registro.id} className="text-sm transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-navy dark:text-slate-100">{registro.estudiante}</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{registro.categoria}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            {registro.metodo === "ESCANEO" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                Escaneo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                Manual
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {formatearFechaHora(registro.fechaHora)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState message="Todavía no hay asistencias registradas." />
            )}
          </article>

          {/* Próximos Eventos */}
          <article className="rounded-xl border border-line bg-surface shadow-sm">
            <PanelHeader title="Próximos eventos" href="/dashboard/admin/calendario" linkLabel="Ver calendario" icon={<CalendarIcon />} />
            {proximasActividades.length ? (
              <div className="divide-y divide-slate-100 px-3 sm:px-5 dark:divide-slate-800">
                {proximasActividades.map((actividad) => (
                  <div key={actividad.id} className="flex gap-3 sm:gap-4 py-3 sm:py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-lg">
                    <DateBadge date={actividad.fecha} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-bold text-navy dark:text-slate-100">
                        {actividad.tipo === "entrenamiento" ? actividad.categoria ?? actividad.titulo : actividad.titulo}
                      </p>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                        <span className="capitalize font-semibold">{actividad.tipo}</span> · {actividad.horaInicio}{actividad.horaFin ? ` – ${actividad.horaFin}` : ""}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">{actividad.ubicacion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No hay eventos programados." />
            )}
          </article>
        </section>
      </div>
    </RoleGuard>
  );
}

function ClipboardListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function fechaLocal(fecha: Date) { return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`; }
function formatearFechaHora(fechaHora: string) { return formatoFechaHora(fechaHora); }

function PanelHeader({ title, href, linkLabel, icon }: { title: string; href: string; linkLabel: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <Link href={href} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary-light hover:underline dark:text-blue-300">
        {icon}
        <span>{linkLabel}</span>
      </Link>
    </div>
  );
}
function DateBadge({ date }: { date: string }) {
  const fecha = new Date(`${date}T12:00:00`);
  return (
    <div className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-xl bg-brand-green-soft text-center dark:bg-brand-green/15">
      <div>
        <span className="block text-base sm:text-lg font-black leading-none text-brand-green dark:text-brand-lime-light">{fecha.getDate()}</span>
        <span className="mt-0.5 block text-[9px] sm:text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{new Intl.DateTimeFormat("es-PE", { month: "short" }).format(fecha).replace(".", "")}</span>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) { return <p className="px-5 py-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">{message}</p>; }