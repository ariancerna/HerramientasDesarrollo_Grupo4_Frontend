"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";

interface SeccionAdmin {
  titulo: string;
  descripcion: string;
  href: string;
  icono: string;
}

const SECCIONES: SeccionAdmin[] = [
  {
    titulo: "Alumnos",
    descripcion: "Busca, filtra, crea, edita y elimina alumnos del club.",
    href: "/dashboard/admin/alumnos",
    icono: "👤",
  },
  {
    titulo: "Asistencia",
    descripcion: "Consulta y administra los registros de asistencia.",
    href: "/dashboard/admin/asistencia",
    icono: "✅",
  },
  {
    titulo: "Categorías",
    descripcion: "Gestiona las categorías del club (Sub-10, Sub-12, etc.).",
    href: "/dashboard/admin/categorias",
    icono: "🏷️",
  },
  {
    titulo: "Reportes",
    descripcion: "Revisa estadísticas y reportes de asistencia.",
    href: "/dashboard/admin/reportes",
    icono: "📊",
  },
  {
    titulo: "Configuración",
    descripcion: "Ajustes generales del sistema.",
    href: "/dashboard/admin/configuracion",
    icono: "⚙️",
  },
];

export default function AdminDashboardPage() {
  const { session } = useAuth();

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
            KickStamp · Administración
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Hola, {session?.usuario.nombre ?? "administrador"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Elige una sección para continuar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECCIONES.map((seccion) => (
            <Link
              key={seccion.href}
              href={seccion.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
            >
              <span className="text-3xl">{seccion.icono}</span>
              <h2 className="mt-3 text-lg font-semibold text-slate-950 group-hover:text-amber-700">
                {seccion.titulo}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {seccion.descripcion}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}