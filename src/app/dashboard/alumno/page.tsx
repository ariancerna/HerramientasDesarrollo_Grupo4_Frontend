"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerAsistenciasPorEstudiante } from "@/store/asistencia-store";

export default function AlumnoDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Alumno";
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId ? obtenerAlumnos().find((item) => item.id === estudianteId) : undefined;
  const asistencias = estudianteId ? obtenerAsistenciasPorEstudiante(estudianteId) : [];

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <section className="relative overflow-hidden rounded-xl bg-[#0A1628] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[#6FCF3A]" aria-hidden="true" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold tracking-[0.1em] text-[#9adf76]">MI ESPACIO</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Hola, {primerNombre}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Consulta tu asistencia y mantente al día con tu actividad en el club.</p>
            </div>
            <dl className="rounded-lg border border-white/15 bg-white/5 px-6 py-4 text-center">
              <dt className="text-xs text-slate-300">Asistencias registradas</dt>
              <dd className="mt-1 text-3xl font-bold text-white">{asistencias.length}</dd>
            </dl>
          </div>
        </section>

        <section className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Link href="/dashboard/alumno/historial" className="group flex min-h-48 flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#86c966] hover:shadow-md">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#edf8e8] text-[#16794C]"><HistoryIcon /></span>
              <div>
                <h2 className="text-xl font-bold text-[#0A1628]">Mi historial de asistencia</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">Revisa las fechas y los métodos registrados para tus asistencias.</p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#16794C]">Ver mi historial<ArrowIcon /></span>
          </Link>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#0A1628]">Mi categoría</p>
            <p className="mt-2 text-lg font-bold text-[#16794C]">{alumno?.categoria ?? "Sin categoría"}</p>
            <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-500">Tu asistencia se registra durante los entrenamientos.</p>
          </aside>
        </section>
      </div>
    </RoleGuard>
  );
}

function HistoryIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><path d="M3 3v5h5M3.05 13a9 9 0 1 0 2.13-7.14L3 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ArrowIcon() { return <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
