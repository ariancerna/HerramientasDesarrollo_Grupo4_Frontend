"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerCategorias } from "@/store/categorias-store";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerProximasActividades } from "@/store/calendario-store";

const fechaActual = new Intl.DateTimeFormat("es-PE", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

const ACCESOS = [
  {
    titulo: "Registrar asistencia",
    descripcion: "Escanea el DNI del alumno o realiza un registro manual.",
    href: "/dashboard/profesor/asistencia",
    etiqueta: "Ir al registro",
    icono: AttendanceIcon,
  },
  {
    titulo: "Consultar alumnos",
    descripcion: "Revisa el padrón y encuentra alumnos por nombre, DNI o categoría.",
    href: "/dashboard/profesor/alumnos",
    etiqueta: "Ver alumnos",
    icono: StudentsIcon,
  },
];

export default function ProfesorDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Profesor";
  const categorias = obtenerCategorias().filter((categoria) => categoria.profesorIds?.includes(session?.usuario.id ?? ""));
  const alumnos = obtenerAlumnos().filter((alumno) => categorias.some((categoria) => categoria.nombre === alumno.categoria));
  const proximaSesion = categorias.flatMap((categoria) => obtenerProximasActividades(categoria.nombre, new Date(), 1)).sort((a, b) => `${a.fecha}${a.horaInicio}`.localeCompare(`${b.fecha}${b.horaInicio}`))[0];

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
          <section className="relative px-0 py-1">
            <div className="relative flex max-w-none flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark dark:text-emerald-400">
                {fechaActual}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Buenos días, {primerNombre}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Desde aquí puedes registrar la asistencia del entrenamiento y consultar
                la información de tus alumnos.
              </p>
              </div>
              <Link
                href="/dashboard/profesor/asistencia"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Registrar asistencia
                <ArrowIcon />
              </Link>
            </div>
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_0.8fr_0.8fr]">
            <article className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-500/25 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark dark:text-emerald-400">Próxima sesión</p><h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{proximaSesion?.categoria ?? "Sin sesión asignada"}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{proximaSesion ? `${proximaSesion.ubicacion} · ${proximaSesion.horaInicio} – ${proximaSesion.horaFin}` : "Revisa tu horario o consulta a administración."}</p></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400"><AttendanceIcon /></span></div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800"><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{proximaSesion ? formatearFecha(proximaSesion.fecha) : ""}</span><Link href="/dashboard/profesor/asistencia" className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-hover">Tomar asistencia</Link></div>
            </article>
            <MetricCard label="Alumnos asignados" value={alumnos.length} detail={`${categorias.length} categorías activas`} href="/dashboard/profesor/alumnos" />
            <MetricCard label="Pendiente hoy" value="2" detail="Evaluaciones por registrar" href="/dashboard/profesor/evaluaciones" />
          </section>

          <section className="mt-9" aria-labelledby="accesos-title">
            <div className="mb-4">
              <h2 id="accesos-title" className="text-xl font-bold text-ink dark:text-white">
                Herramientas de trabajo
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Selecciona la tarea que deseas realizar.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {ACCESOS.map((acceso) => {
                const Icon = acceso.icono;

                return (
                  <Link
                    key={acceso.href}
                    href={acceso.href}
                    className="group flex min-h-44 flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#86c966] hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500/60"
                  >
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400">
                        <Icon />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-ink dark:text-white">
                          {acceso.titulo}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {acceso.descripcion}
                        </p>
                      </div>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-emerald-400">
                      {acceso.etiqueta}
                      <ArrowIcon />
                    </span>
                  </Link>
                );
              })}
            </div>
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

function StudentsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
  return <Link href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"><p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p><p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{detail}</p><span className="mt-4 block text-xs font-bold text-primary-dark dark:text-emerald-400">Abrir módulo →</span></Link>;
}

function formatearFecha(fecha: string) { return new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "short" }).format(new Date(`${fecha}T12:00:00`)); }
