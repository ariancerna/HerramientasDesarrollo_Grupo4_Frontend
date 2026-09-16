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
      <div>
        <DashboardWelcomeBanner
          name={primerNombre}
          description="Bienvenido al panel de administración del Club de Vóley El Golazo."
          quote="El trabajo en equipo hace la diferencia"
        />

        <section className="mt-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:divide-x-0">
            <Metric label="Alumnos registrados" value={alumnos.length} />
            <Metric label="Alumnos activos" value={activos} />
            <Metric label="Asistencias hoy" value={asistenciasHoy} />
          </dl>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-green dark:text-brand-lime-light">Requiere atención</p>
                <h2 className="mt-2 text-xl font-bold text-navy dark:text-white">{pagosPendientes.length + pagosVencidos.length} mensualidad(es) por regularizar</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Revisa los pagos pendientes y vencidos antes del siguiente entrenamiento.</p>
              </div>
              <Link href="/dashboard/admin/pagos" className="rounded-lg bg-brand-green px-3 py-2 text-xs font-bold text-white hover:bg-brand-green-dark">Gestionar pagos</Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
              <MiniMetric label="Pagos vencidos" value={pagosVencidos.length} />
              <MiniMetric label="Próxima actividad" value={proximaActividad ? formatearFecha(proximaActividad.fecha) : "Sin agenda"} />
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="font-bold text-navy dark:text-white">Estado operativo</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Resumen de situaciones que requieren seguimiento.</p>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              <StatusRow label="Pagos vencidos" value={pagosVencidos.length} tone="danger" />
              <StatusRow label="Pagos pendientes" value={pagosPendientes.length} tone="warning" />
              <StatusRow label="Alumnos inactivos" value={inactivos} tone="neutral" />
            </div>
          </article>
        </section>

        <section className="mt-9 grid gap-4 xl:grid-cols-[1.35fr_0.9fr]" aria-label="Información operativa">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <PanelHeader title="Últimos registros" description="Asistencias registradas recientemente" href="/dashboard/admin/asistencia" linkLabel="Ver todos" />
            {recientes.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Alumno</th>
                      <th className="px-5 py-3 font-semibold">Registro</th>
                      <th className="px-5 py-3 font-semibold">Fecha y hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recientes.map((registro) => (
                      <tr key={registro.id} className="text-sm">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-navy dark:text-slate-100">{registro.estudiante}</p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{registro.categoria}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-brand-green-soft px-2.5 py-1 text-xs font-bold text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
                            {registro.metodo === "ESCANEO" ? "Escaneo" : "Manual"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{formatearFechaHora(registro.fechaHora)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="Todavía no hay asistencias registradas." />
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <PanelHeader title="Próximos eventos" description="Agenda general del club" href="/dashboard/admin/calendario" linkLabel="Ver calendario" />
            {proximasActividades.length ? (
              <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
                {proximasActividades.map((actividad) => (
                  <div key={actividad.id} className="flex gap-4 py-4">
                    <DateBadge date={actividad.fecha} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-navy dark:text-slate-100">{actividad.titulo}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{actividad.horaInicio}{actividad.horaFin ? ` – ${actividad.horaFin}` : ""}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">{actividad.ubicacion}</p>
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-2 text-3xl font-bold tracking-tight text-navy dark:text-white">{value}</dd>
      <p className="mt-1 text-xs font-medium text-brand-green dark:text-brand-lime-light">Actualizado hoy</p>
    </div>
  );
}
function MiniMetric({ label, value }: { label: string; value: string | number }) { return <div><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-navy dark:text-white">{value}</p></div>; }
function formatearFecha(fecha: string) { return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${fecha}T12:00:00`)); }
function fechaLocal(fecha: Date) { return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`; }
function formatearFechaHora(fechaHora: string) { return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(fechaHora)); }

function StatusRow({ label, value, tone }: { label: string; value: number; tone: "danger" | "warning" | "neutral" }) {
  const tones = { danger: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300", warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" };
  return <div className="flex items-center justify-between py-3 text-sm"><span className="text-slate-600 dark:text-slate-300">{label}</span><span className={`min-w-8 rounded-full px-2.5 py-1 text-center text-xs font-bold ${tones[tone]}`}>{value}</span></div>;
}

function PanelHeader({ title, description, href, linkLabel }: { title: string; description: string; href: string; linkLabel: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800"><div><h2 className="font-bold text-navy dark:text-white">{title}</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p></div><Link href={href} className="whitespace-nowrap text-xs font-bold text-brand-green dark:text-brand-lime-light">{linkLabel} →</Link></div>;
}

function DateBadge({ date }: { date: string }) {
  const fecha = new Date(`${date}T12:00:00`);
  return <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-green-soft text-center dark:bg-brand-green/15"><div><span className="block text-lg font-black leading-none text-brand-green dark:text-brand-lime-light">{fecha.getDate()}</span><span className="mt-1 block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{new Intl.DateTimeFormat("es-PE", { month: "short" }).format(fecha).replace(".", "")}</span></div></div>;
}

function EmptyState({ message }: { message: string }) { return <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">{message}</p>; }
