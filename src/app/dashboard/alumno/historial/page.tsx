"use client";

import Link from "next/link";
import AsistenciaTabla from "@/components/shared/asistencia-tabla";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerAsistenciasPorEstudiante } from "@/store/asistencia-store";

export default function HistorialAlumnoPage() {
  const { session } = useAuth();
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId
    ? obtenerAlumnos().find((item) => item.id === estudianteId)
    : undefined;
  const registros = estudianteId
    ? [...obtenerAsistenciasPorEstudiante(estudianteId)].sort(
        (a, b) =>
          new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime(),
      )
    : [];

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
          <Link
            href="/dashboard/alumno"
            className="inline-flex items-center text-sm font-semibold text-slate-600 transition hover:text-[#16794C]"
          >
            ← Volver al inicio
          </Link>

          <header className="mt-5 mb-6">
            <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">
              MI ESPACIO
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Mi historial de asistencia
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {alumno
                ? `${alumno.nombres} ${alumno.apellidos} · ${alumno.categoria}`
                : "Consulta todas tus asistencias registradas."}
            </p>
          </header>

          {!estudianteId ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
            >
              No se pudo identificar al alumno asociado a esta sesión.
            </div>
          ) : (
            <>
              <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Asistencias registradas</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">
                  {registros.length}
                </p>
              </section>

              <AsistenciaTabla registros={registros} />
            </>
          )}
      </div>
    </RoleGuard>
  );
}
