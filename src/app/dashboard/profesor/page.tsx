"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { DashboardWelcomeBanner } from "@/components/shared/dashboard-welcome-banner";
import { useAuth } from "@/hooks/use-auth";
import { obtenerCategorias } from "@/store/categorias-store";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerProximasActividades } from "@/store/calendario-store";
import { obtenerEvaluacionesPorProfesor } from "@/store/evaluaciones-store";

export default function ProfesorDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Profesor";
  const profesorId = session?.usuario.id ?? "";
  const categorias = obtenerCategorias().filter((categoria) => categoria.profesorIds?.includes(session?.usuario.id ?? ""));
  const alumnos = obtenerAlumnos().filter((alumno) => categorias.some((categoria) => categoria.nombre === alumno.categoria));
  const proximasSesiones = categorias
    .flatMap((categoria) => obtenerProximasActividades(categoria.nombre, new Date(), 4))
    .filter((actividad, index, lista) => lista.findIndex((item) => item.id === actividad.id) === index)
    .sort((a, b) => `${a.fecha}${a.horaInicio}`.localeCompare(`${b.fecha}${b.horaInicio}`))
    .slice(0, 4);
  const proximaSesion = proximasSesiones[0];
  const evaluaciones = profesorId ? obtenerEvaluacionesPorProfesor(profesorId) : [];
  const ultimaEvaluacionPorAlumno = new Map(evaluaciones.map((evaluacion) => [evaluacion.alumnoId, evaluacion]));
  const seguimiento = [...alumnos]
    .sort((a, b) => Number(ultimaEvaluacionPorAlumno.has(a.id)) - Number(ultimaEvaluacionPorAlumno.has(b.id)))
    .slice(0, 5);
  const alumnosSinEvaluacion = alumnos.filter((alumno) => !ultimaEvaluacionPorAlumno.has(alumno.id)).length;

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <DashboardWelcomeBanner
          name={primerNombre}
          description="Desde aquí puedes registrar la asistencia del entrenamiento y consultar la información de tus alumnos."
          quote="Inspirando el talento y la dedicación en cada saque."
          action={{
            href: "/dashboard/profesor/asistencia",
            label: "Registrar asistencia",
            mobileLabel: "Registrar",
            icon: <ArrowIcon />,
          }}
        />

          <section className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_0.8fr_0.8fr]">
            <article className="relative overflow-hidden rounded-2xl border border-brand-green/20 bg-white p-6 shadow-sm dark:border-brand-green/30 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-green dark:text-brand-lime-light">Próxima sesión</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{proximaSesion?.categoria ?? "Sin sesión asignada"}</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{proximaSesion ? `${proximaSesion.ubicacion} · ${proximaSesion.horaInicio} – ${proximaSesion.horaFin}` : "Revisa tu horario o consulta a administración."}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light"><AttendanceIcon /></span>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{proximaSesion ? formatearFecha(proximaSesion.fecha) : ""}</span>
                <Link href="/dashboard/profesor/asistencia" className="rounded-lg bg-brand-green px-3 py-2 text-xs font-bold text-white hover:bg-brand-green-dark">Tomar asistencia</Link>
              </div>
            </article>
            <MetricCard label="Alumnos asignados" value={alumnos.length} detail={`${categorias.length} categorías activas`} href="/dashboard/profesor/alumnos" />
            <MetricCard label="Seguimiento pendiente" value={alumnosSinEvaluacion} detail="Alumnos sin evaluación" href="/dashboard/profesor/evaluaciones" />
          </section>

          <section className="mt-9 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]" aria-label="Agenda y seguimiento">
            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <PanelHeader title="Agenda de trabajo" description="Tus próximas sesiones y eventos" href="/dashboard/profesor/horario" linkLabel="Ver horario" />
              {proximasSesiones.length ? (
                <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
                  {proximasSesiones.map((actividad) => (
                    <div key={actividad.id} className="flex items-center gap-4 py-4">
                      <DateBadge date={actividad.fecha} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-bold text-navy dark:text-slate-100">{actividad.categoria ?? actividad.titulo}</p>
                          <span className="rounded-full bg-brand-green-soft px-2 py-0.5 text-[10px] font-bold uppercase text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">{actividad.tipo}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{actividad.horaInicio}{actividad.horaFin ? ` – ${actividad.horaFin}` : ""} · {actividad.ubicacion}</p>
                      </div>
                      <Link href="/dashboard/profesor/asistencia" aria-label={`Registrar asistencia de ${actividad.categoria ?? actividad.titulo}`} className="hidden rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-brand-green transition hover:border-brand-lime sm:block dark:border-slate-700 dark:text-brand-lime-light">Registrar</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No tienes sesiones programadas." />
              )}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <PanelHeader title="Seguimiento de alumnos" description="Estado de sus evaluaciones" href="/dashboard/profesor/evaluaciones" linkLabel="Ver evaluaciones" />
              {seguimiento.length ? (
                <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
                  {seguimiento.map((alumno) => {
                    const evaluacion = ultimaEvaluacionPorAlumno.get(alumno.id);
                    return (
                      <div key={alumno.id} className="flex items-center justify-between gap-4 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">{alumno.nombres} {alumno.apellidos}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{alumno.categoria}</p>
                        </div>
                        {evaluacion ? (
                          <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Evaluado {formatearFechaCorta(evaluacion.fecha)}</span>
                        ) : (
                          <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">Por evaluar</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="No hay alumnos asignados." />
              )}
            </article>
          </section>
      </div>
    </RoleGuard>
  );
}

function AttendanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.5 15 2 2 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({ label, value, detail, href }: { label: string; value: string | number; detail: string; href: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
      <span className="mt-4 block text-xs font-bold text-brand-green dark:text-brand-lime-light">Abrir módulo →</span>
    </Link>
  );
}

function formatearFecha(fecha: string) { return new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "short" }).format(new Date(`${fecha}T12:00:00`)); }
function formatearFechaCorta(fecha: string) { return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${fecha}T12:00:00`)); }

function PanelHeader({ title, description, href, linkLabel }: { title: string; description: string; href: string; linkLabel: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800"><div><h2 className="font-bold text-navy dark:text-white">{title}</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p></div><Link href={href} className="whitespace-nowrap text-xs font-bold text-brand-green dark:text-brand-lime-light">{linkLabel} →</Link></div>;
}

function DateBadge({ date }: { date: string }) {
  const fecha = new Date(`${date}T12:00:00`);
  return <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-green-soft text-center dark:bg-brand-green/15"><div><span className="block text-lg font-black leading-none text-brand-green dark:text-brand-lime-light">{fecha.getDate()}</span><span className="mt-1 block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{new Intl.DateTimeFormat("es-PE", { month: "short" }).format(fecha).replace(".", "")}</span></div></div>;
}

function EmptyState({ message }: { message: string }) { return <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">{message}</p>; }
