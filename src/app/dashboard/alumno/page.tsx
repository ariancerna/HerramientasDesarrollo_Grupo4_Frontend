"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerAsistenciasPorEstudiante } from "@/store/asistencia-store";
import { obtenerMensualidadActual } from "@/store/pagos-store";
import { obtenerProximasActividades } from "@/store/calendario-store";

export default function AlumnoDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Alumno";
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId ? obtenerAlumnos().find((item) => item.id === estudianteId) : undefined;
  const asistencias = estudianteId ? obtenerAsistenciasPorEstudiante(estudianteId) : [];
  const mensualidad = estudianteId ? obtenerMensualidadActual(estudianteId) : undefined;
  const actividades = alumno ? obtenerProximasActividades(alumno.categoria, new Date(), 3) : [];
  const proximaActividad = actividades[0];
  const asistenciaPorcentaje = asistencias.length ? Math.min(100, asistencias.length * 10) : 0;

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <section className="relative px-0 py-1">
          <div className="relative">
            <div className="max-w-xl">
              <p className="text-xs font-bold tracking-[0.14em] text-[#16794C] dark:text-emerald-400">MI ESPACIO</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Buenos días, {primerNombre}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">Consulta tu asistencia, mensualidades y próximas actividades en un solo lugar.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"><dt className="text-xs text-slate-500 dark:text-slate-400">Asistencias</dt><dd className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">{asistencias.length}</dd></dl>
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"><dt className="text-xs text-slate-500 dark:text-slate-400">Estado de pago</dt><dd className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{mensualidad?.estado === "pagado" ? "Al día" : "Pendiente"}</dd></dl>
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"><dt className="text-xs text-slate-500 dark:text-slate-400">Próxima actividad</dt><dd className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{proximaActividad?.horaInicio ?? "Sin agenda"}</dd></dl>
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"><dt className="text-xs text-slate-500 dark:text-slate-400">Categoría</dt><dd className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-white">{alumno?.categoria ?? "Por asignar"}</dd></dl>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.55fr_0.8fr_0.8fr]">
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16794C] to-[#0f5134] p-6 text-white shadow-sm sm:p-7">
            <div className="absolute -right-9 -top-10 h-40 w-40 rounded-full border-[26px] border-white/10" aria-hidden="true" />
            <p className="relative text-xs font-bold uppercase tracking-[0.14em] text-emerald-100">Tu siguiente actividad</p>
            {proximaActividad ? <>
              <h2 className="relative mt-3 text-2xl font-bold">{proximaActividad.titulo}</h2>
              <p className="relative mt-2 text-sm text-emerald-50">{proximaActividad.categoria} · {proximaActividad.ubicacion}</p>
              <div className="relative mt-6 flex items-end justify-between gap-4">
                <p className="text-sm font-semibold">{formatearActividad(proximaActividad.fecha, proximaActividad.horaInicio)}</p>
                <Link href="/dashboard/alumno/calendario" className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#12613D] transition hover:bg-emerald-50">Ver agenda</Link>
              </div>
            </> : <p className="relative mt-3 text-sm text-emerald-50">No tienes actividades programadas por ahora.</p>}
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Asistencia</p>
            <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{asistenciaPorcentaje}%</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-[#6FCF3A]" style={{ width: `${asistenciaPorcentaje}%` }} /></div>
            <Link href="/dashboard/alumno/historial" className="mt-4 inline-block text-xs font-bold text-[#16794C] dark:text-emerald-400">Ver historial →</Link>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Mensualidad</p>
            <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{mensualidad?.estado === "pagado" ? "Al día" : mensualidad?.estado === "vencido" ? "Pago vencido" : "Pago pendiente"}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{mensualidad ? `Vence el ${formatearFechaCorta(mensualidad.vencimiento)}` : "Sin mensualidad registrada"}</p>
            <Link href="/dashboard/alumno/pagos" className="mt-4 inline-block text-xs font-bold text-[#16794C] dark:text-emerald-400">Ver detalle →</Link>
          </article>
        </section>

        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold text-[#0A1628] dark:text-white">Tu espacio</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestiona tu información y revisa tus avances.</p></div><Link href="/dashboard/alumno/calendario" className="hidden text-sm font-bold text-[#16794C] dark:text-emerald-400 sm:block">Agenda completa →</Link></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        </div></section>

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
function formatearActividad(fecha: string, hora: string) { return `${new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "short" }).format(new Date(`${fecha}T12:00:00`))} · ${hora}`; }
function formatearFechaCorta(fecha: string) { return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${fecha}T12:00:00`)); }
