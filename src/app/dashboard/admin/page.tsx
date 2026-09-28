"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { DashboardWelcomeBanner } from "@/components/shared/dashboard-welcome-banner";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerRegistrosAsistencia } from "@/store/asistencia-store";
import { obtenerProximasActividadesTodas } from "@/store/calendario-store";
import { obtenerPagos } from "@/store/pagos-store";

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Administrador";
  const alumnos = obtenerAlumnos();
  const asistencias = obtenerRegistrosAsistencia();
  const pagos = obtenerPagos();
  const activos = alumnos.filter((alumno) => alumno.estado === "activo").length;
  const inactivos = alumnos.length - activos;
  const pagosPendientes = pagos.filter((pago) => pago.estado === "pendiente");
  const pagosVencidos = pagos.filter((pago) => pago.estado === "vencido");
  const hoy = fechaLocal(new Date());
  const asistenciasHoy = asistencias.filter((registro) => fechaLocal(new Date(registro.fechaHora)) === hoy).length;
  const proximasActividades = obtenerProximasActividadesTodas(new Date(), 4);
  const proximaActividad = proximasActividades[0];
  const recientes = asistencias.slice(0, 5);

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div className="w-full max-w-full overflow-x-hidden px-1 sm:px-0">
        <DashboardWelcomeBanner
          name={primerNombre}
          description="Bienvenido al panel de administración del Club de Vóley El Golazo."
          quote="El trabajo en equipo hace la diferencia"
        />

        {/* Métricas Principales */}
        <section className="mt-4 sm:mt-6">
          <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4">
            <Metric label="Alumnos registrados" value={alumnos.length} icon={<UsersMetricIcon />} tone="blue" />
            <Metric label="Alumnos activos" value={activos} icon={<CheckMetricIcon />} tone="green" />
            <Metric label="Asistencias hoy" value={asistenciasHoy} icon={<ClipboardMetricIcon />} tone="amber" />
          </dl>
        </section>

        {/* Panel Alertas / Estado */}
        <section className="mt-4 sm:mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy dark:text-white leading-tight">
                  {pagosPendientes.length + pagosVencidos.length} mensualidad(es) por regularizar
                </h2>
              </div>
              <Link 
                href="/dashboard/admin/pagos" 
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-green-dark active:scale-[0.98]"
              >
                <CreditCardIcon />
                <span>Pagos</span>
              </Link>
            </div>
            <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 sm:pt-5 dark:border-slate-800">
              <MiniMetric label="Pagos vencidos" value={pagosVencidos.length} />
              <MiniMetric label="Próxima actividad" value={proximaActividad ? formatearFecha(proximaActividad.fecha) : "Sin agenda"} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-navy dark:text-white">Estado operativo</h2>
            <div className="mt-3 sm:mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              <StatusRow label="Pagos vencidos" value={pagosVencidos.length} tone="danger" />
              <StatusRow label="Pagos pendientes" value={pagosPendientes.length} tone="warning" />
              <StatusRow label="Alumnos inactivos" value={inactivos} tone="neutral" />
            </div>
          </article>
        </section>

        {/* Tablas / Listas Responsivas (App Native Feel) */}
        <section className="mt-6 sm:mt-8 grid gap-4 xl:grid-cols-[1.35fr_0.9fr]" aria-label="Información operativa">
          {/* Últimos Registros */}
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <PanelHeader title="Últimos registros" href="/dashboard/admin/asistencia" linkLabel="Registros" icon={<ClipboardListIcon />} />
            
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
          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <PanelHeader title="Próximos eventos" href="/dashboard/admin/calendario" linkLabel="Calendario" icon={<CalendarIcon />} />
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

function Metric({
  label,
  value,
  icon,
  tone = "green",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "green" | "blue" | "amber";
}) {
  const toneClass = {
    green: "bg-brand-green/10 text-brand-green dark:bg-brand-lime-light/10 dark:text-brand-lime-light",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:px-5 sm:py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">{label}</dt>
        <span className={`grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full ${toneClass}`}>
          {icon}
        </span>
      </div>
      <dd className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-navy dark:text-white">{value}</dd>
    </div>
  );
}

function UsersMetricIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19c.8-3.3 2.7-5 5.5-5s4.7 1.7 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 14c1.8.6 3 2.1 3.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckMetricIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.5 12.5 2.3 2.3L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClipboardMetricIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <rect x="5" y="4.5" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 4.5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 11h7M8.5 15h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
    </svg>
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

function MiniMetric({ label, value }: { label: string; value: string | number }) { 
  return (
    <div>
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm sm:text-base font-extrabold text-navy dark:text-white">{value}</p>
    </div>
  ); 
}

function formatearFecha(fecha: string) { return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${fecha}T12:00:00`)); }
function fechaLocal(fecha: Date) { return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`; }
function formatearFechaHora(fechaHora: string) { return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(fechaHora)); }

function StatusRow({ label, value, tone }: { label: string; value: number; tone: "danger" | "warning" | "neutral" }) {
  const tones = { danger: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300", warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" };
  return <div className="flex items-center justify-between py-2.5 sm:py-3 text-xs sm:text-sm"><span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span><span className={`min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-extrabold ${tones[tone]}`}>{value}</span></div>;
}

function PanelHeader({ title, href, linkLabel, icon }: { title: string; href: string; linkLabel: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4 dark:border-slate-800">
      <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-navy dark:text-white">{title}</h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-green px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-green-dark active:scale-95"
      >
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