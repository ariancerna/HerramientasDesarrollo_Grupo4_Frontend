"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";

export default function AlumnoDashboardPage() {
  const { session } = useAuth();

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
            KickStamp · Alumno
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Hola, {session?.usuario.nombre ?? "alumno"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Consulta tus asistencias registradas.
          </p>
        </div>

        <Link
          href="/dashboard/alumno/historial"
          className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <span className="text-3xl">📋</span>
          <h2 className="mt-3 text-lg font-semibold text-slate-950 hover:text-amber-700">
            Mi historial de asistencia
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Revisa las fechas y métodos de tus asistencias registradas.
          </p>
        </Link>
      </div>
    </RoleGuard>
  );
}