"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/shared/role-guard";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";

export default function AlumnoDashboardPage() {
  const { session, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
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

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </header>

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
      </main>
    </RoleGuard>
  );
}
