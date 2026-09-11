"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerRegistrosAsistencia } from "@/store/asistencia-store";
import { obtenerProximasActividadesTodas } from "@/store/calendario-store";

interface SeccionAdmin {
  titulo: string;
  descripcion: string;
  href: string;
  etiqueta: string;
  icono: ComponentType;
}

const SECCIONES: SeccionAdmin[] = [
  { titulo: "Alumnos", descripcion: "Administra el padrón, datos y estado de cada jugador.", href: "/dashboard/admin/alumnos", etiqueta: "Gestionar alumnos", icono: StudentsIcon },
  { titulo: "Profesores", descripcion: "Da de alta profesores y asígnalos a una sede.", href: "/dashboard/admin/profesores", etiqueta: "Gestionar profesores", icono: TeacherIcon },
  { titulo: "Asistencia", descripcion: "Revisa los registros y corrige datos cuando sea necesario.", href: "/dashboard/admin/asistencia", etiqueta: "Ver asistencia", icono: AttendanceIcon },
  { titulo: "Pagos", descripcion: "Registra pagos y revisa las deudas pendientes de los alumnos.", href: "/dashboard/admin/pagos", etiqueta: "Gestionar pagos", icono: PaymentsIcon },
    { titulo: "Calendario", descripcion: "Programa entrenamientos especiales, torneos y eventos del club.", href: "/dashboard/admin/calendario", etiqueta: "Ver calendario", icono: CalendarIcon },
  { titulo: "Categorías", descripcion: "Organiza los grupos deportivos del club.", href: "/dashboard/admin/categorias", etiqueta: "Ver categorías", icono: TagIcon },
  { titulo: "Sedes", descripcion: "Administra los locales donde opera el club.", href: "/dashboard/admin/sedes", etiqueta: "Gestionar sedes", icono: LocationIcon },
  { titulo: "Reportes", descripcion: "Consulta los indicadores de participación del club.", href: "/dashboard/admin/reportes", etiqueta: "Ver reportes", icono: ChartIcon },
  { titulo: "Configuración", descripcion: "Gestiona los ajustes generales del sistema.", href: "/dashboard/admin/configuracion", etiqueta: "Abrir configuración", icono: GearIcon },
];

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Administrador";
  const alumnos = obtenerAlumnos();
  const asistencias = obtenerRegistrosAsistencia();
  const activos = alumnos.filter((alumno) => alumno.estado === "activo").length;
  const pendientes = alumnos.length - activos;
  const proximaActividad = obtenerProximasActividadesTodas(new Date(), 1)[0];
  const recientes = asistencias.slice(0, 3);

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <section className="relative px-0 py-1">
          <div className="relative">
            <div className="max-w-xl">
              <p className="text-xs font-bold tracking-[0.14em] text-primary-dark dark:text-emerald-400">ADMINISTRACIÓN</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink dark:text-white sm:text-3xl">Buenos días, {primerNombre}</h1>
              <p className="mt-2 text-sm leading-6 text-body dark:text-slate-400 sm:text-base">
                Gestiona la operación diaria del club desde un solo lugar.
              </p>
            </div>
            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:divide-x-0">
              <Metric label="Alumnos" value={alumnos.length} />
              <Metric label="Activos" value={activos} />
              <Metric label="Registros" value={asistencias.length} />
            </dl>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark dark:text-emerald-400">Requiere atención</p><h2 className="mt-2 text-xl font-bold text-ink dark:text-white">{pendientes} alumno(s) con pago pendiente</h2><p className="mt-2 text-sm text-body dark:text-slate-400">Revisa el estado de mensualidad y registra los pagos recibidos.</p></div><Link href="/dashboard/admin/pagos" className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-hover">Gestionar pagos</Link></div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5 dark:border-slate-800"><MiniMetric label="Asistencia registrada" value={asistencias.length} /><MiniMetric label="Próxima actividad" value={proximaActividad ? formatearFecha(proximaActividad.fecha) : "Sin agenda"} /></div>
          </article>
          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"><div className="flex items-center justify-between"><h2 className="font-bold text-ink dark:text-white">Actividad reciente</h2><Link href="/dashboard/admin/asistencia" className="text-xs font-bold text-primary-dark dark:text-emerald-400">Ver todo →</Link></div><div className="mt-4 space-y-3">{recientes.length ? recientes.map((registro) => <div key={registro.id} className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{registro.estudiante}</p><p className="text-xs text-body dark:text-slate-400">{registro.categoria}</p></div><span className="whitespace-nowrap text-xs text-muted">{new Date(registro.fechaHora).toLocaleDateString("es-PE")}</span></div>) : <p className="text-sm text-body">Sin registros recientes.</p>}</div></article>
        </section>

        <section className="mt-9" aria-labelledby="admin-actions-title">
          <div className="mb-4">
            <h2 id="admin-actions-title" className="text-xl font-bold text-ink dark:text-white">Gestión del club</h2>
            <p className="mt-1 text-sm text-body dark:text-slate-400">Selecciona el área que deseas administrar.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SECCIONES.slice(0, 6).map((seccion) => {
              const Icon = seccion.icono;
              return (
                <Link key={seccion.href} href={seccion.href} className="group flex min-h-44 flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-light/60 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500/60">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400"><Icon /></span>
                    <div>
                      <h3 className="text-lg font-bold text-ink dark:text-white">{seccion.titulo}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-body dark:text-slate-400">{seccion.descripcion}</p>
                    </div>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-emerald-400">{seccion.etiqueta}<ArrowIcon /></span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </RoleGuard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="min-w-20 rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"><dt className="text-sm font-medium text-body dark:text-slate-400">{label}</dt><dd className="mt-2 text-3xl font-bold tracking-tight text-ink dark:text-white">{value}</dd><p className="mt-1 text-xs font-medium text-primary-dark dark:text-emerald-400">Actualizado hoy</p></div>;
}
function MiniMetric({ label, value }: { label: string; value: string | number }) { return <div><p className="text-xs text-body dark:text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-ink dark:text-white">{value}</p></div>; }
function formatearFecha(fecha: string) { return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${fecha}T12:00:00`)); }

function IconFrame({ children }: { children: React.ReactNode }) { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">{children}</svg>; }
function StudentsIcon() { return <IconFrame><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function AttendanceIcon() { return <IconFrame><path d="M7 3v3M17 3v3M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="m8.5 15 2 2 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></IconFrame>; }
function PaymentsIcon() { return <IconFrame><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 9h18M7 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function TagIcon() { return <IconFrame><path d="M11.5 3H5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .59 1.41l8.5 8.5a2 2 0 0 0 2.82 0l6.5-6.5a2 2 0 0 0 0-2.82l-8.5-8.5A2 2 0 0 0 11.5 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /></IconFrame>; }
function ChartIcon() { return <IconFrame><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function GearIcon() { return <IconFrame><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function TeacherIcon() { return <IconFrame><circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M5 20c.7-3.8 3-6 7-6s6.3 2.2 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function LocationIcon() { return <IconFrame><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.8" /></IconFrame>; }
function ArrowIcon() { return <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function CalendarIcon() { return <IconFrame><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="8" cy="14" r="1.2" fill="currentColor" /><circle cx="12" cy="14" r="1.2" fill="currentColor" /><circle cx="16" cy="14" r="1.2" fill="currentColor" /></IconFrame>; }