"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerAsistenciasPorEstudiante } from "@/store/asistencia-store";
import { obtenerMensualidadActual } from "@/store/pagos-store";

export default function AlumnoDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Alumno";
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId ? obtenerAlumnos().find((item) => item.id === estudianteId) : undefined;
  const asistencias = estudianteId ? obtenerAsistenciasPorEstudiante(estudianteId) : [];
  const mensualidad = estudianteId ? obtenerMensualidadActual(estudianteId) : undefined;

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <section className="relative overflow-hidden rounded-xl bg-[#0A1628] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[#6FCF3A]" aria-hidden="true" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold tracking-[0.1em] text-[#9adf76]">MI ESPACIO</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Hola, {primerNombre}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Consulta tu asistencia, mensualidades y próximas actividades en un solo lugar.</p>
            </div>
            <dl className="rounded-lg border border-white/15 bg-white/5 px-6 py-4 text-center">
              <dt className="text-xs text-slate-300">Asistencias registradas</dt>
              <dd className="mt-1 text-3xl font-bold text-white">{asistencias.length}</dd>
            </dl>
          </div>
        </section>

        <section className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ModuloCard
            href="/dashboard/alumno/perfil"
            titulo="Mi perfil"
            descripcion="Actualiza tus datos personales y consulta tu categoría asignada."
            enlace="Ver mi perfil"
            icono={<ProfileIcon />}
          />
          <ModuloCard
            href="/dashboard/alumno/historial"
            titulo="Mi historial"
            descripcion="Revisa y filtra las fechas y métodos de tus asistencias."
            enlace="Consultar historial"
            icono={<HistoryIcon />}
          />
          <ModuloCard
            href="/dashboard/alumno/pagos"
            titulo="Mis pagos"
            descripcion="Consulta el estado actual y el historial de tus mensualidades."
            enlace="Ver mis pagos"
            detalle={mensualidad?.estado === "pagado" ? "Al día" : mensualidad?.estado === "pendiente" ? "Pago pendiente" : mensualidad ? "Pago vencido" : undefined}
            icono={<PaymentsIcon />}
          />
          <ModuloCard
            href="/dashboard/alumno/calendario"
            titulo="Calendario"
            descripcion="Mantente al tanto de entrenamientos y eventos del club."
            enlace="Ver calendario"
            icono={<CalendarIcon />}
          />
        </section>

        <aside className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Categoría asignada</p>
            <p className="mt-1 text-lg font-bold text-[#16794C] dark:text-emerald-400">{alumno?.categoria ?? "Sin categoría"}</p>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-500 sm:text-right dark:text-slate-400">Tu agenda y registros se muestran de acuerdo con la categoría asignada.</p>
        </aside>
      </div>
    </RoleGuard>
  );
}

function ModuloCard({ href, titulo, descripcion, enlace, detalle, icono }: { href: string; titulo: string; descripcion: string; enlace: string; detalle?: string; icono: React.ReactNode }) {
  return (
    <Link href={href} className="group flex min-h-52 flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#86c966] hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500/60">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#edf8e8] text-[#16794C] dark:bg-emerald-500/15 dark:text-emerald-400">{icono}</span>
          {detalle && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">{detalle}</span>}
        </div>
        <h2 className="mt-5 text-xl font-bold text-[#0A1628] dark:text-white">{titulo}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{descripcion}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#16794C] dark:text-emerald-400">{enlace}<ArrowIcon /></span>
    </Link>
  );
}

function HistoryIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><path d="M3 3v5h5M3.05 13a9 9 0 1 0 2.13-7.14L3 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ProfileIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M5 20c.7-3.8 3-6 7-6s6.3 2.2 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function PaymentsIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9h18M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function ArrowIcon() { return <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
