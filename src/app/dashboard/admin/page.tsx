"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerRegistrosAsistencia } from "@/store/asistencia-store";

interface SeccionAdmin {
  titulo: string;
  descripcion: string;
  href: string;
  etiqueta: string;
  icono: ComponentType;
}

const SECCIONES: SeccionAdmin[] = [
  { titulo: "Alumnos", descripcion: "Administra el padrón, datos y estado de cada jugador.", href: "/dashboard/admin/alumnos", etiqueta: "Gestionar alumnos", icono: StudentsIcon },
  { titulo: "Asistencia", descripcion: "Revisa los registros y corrige datos cuando sea necesario.", href: "/dashboard/admin/asistencia", etiqueta: "Ver asistencia", icono: AttendanceIcon },
  { titulo: "Categorías", descripcion: "Organiza los grupos deportivos del club.", href: "/dashboard/admin/categorias", etiqueta: "Ver categorías", icono: TagIcon },
  { titulo: "Reportes", descripcion: "Consulta los indicadores de participación del club.", href: "/dashboard/admin/reportes", etiqueta: "Ver reportes", icono: ChartIcon },
  { titulo: "Configuración", descripcion: "Gestiona los ajustes generales del sistema.", href: "/dashboard/admin/configuracion", etiqueta: "Abrir configuración", icono: GearIcon },
];

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Administrador";
  const alumnos = obtenerAlumnos();
  const asistencias = obtenerRegistrosAsistencia();
  const activos = alumnos.filter((alumno) => alumno.estado === "activo").length;

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <section className="relative overflow-hidden rounded-xl bg-[#0A1628] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[#6FCF3A]" aria-hidden="true" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold tracking-[0.1em] text-[#9adf76]">ADMINISTRACIÓN</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Hola, {primerNombre}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Gestiona la operación diaria del club desde un solo lugar.
              </p>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-white/15 rounded-lg border border-white/15 bg-white/5">
              <Metric label="Alumnos" value={alumnos.length} />
              <Metric label="Activos" value={activos} />
              <Metric label="Registros" value={asistencias.length} />
            </dl>
          </div>
        </section>

        <section className="mt-9" aria-labelledby="admin-actions-title">
          <div className="mb-4">
            <h2 id="admin-actions-title" className="text-xl font-bold text-[#0A1628]">Gestión del club</h2>
            <p className="mt-1 text-sm text-slate-500">Selecciona el área que deseas administrar.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SECCIONES.map((seccion) => {
              const Icon = seccion.icono;
              return (
                <Link key={seccion.href} href={seccion.href} className="group flex min-h-44 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#86c966] hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#edf8e8] text-[#16794C]"><Icon /></span>
                    <div>
                      <h3 className="text-lg font-bold text-[#0A1628]">{seccion.titulo}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">{seccion.descripcion}</p>
                    </div>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#16794C]">{seccion.etiqueta}<ArrowIcon /></span>
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
  return <div className="min-w-20 px-3 py-3 text-center sm:px-5"><dt className="text-xs text-slate-300">{label}</dt><dd className="mt-1 text-xl font-bold text-white">{value}</dd></div>;
}

function IconFrame({ children }: { children: React.ReactNode }) { return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">{children}</svg>; }
function StudentsIcon() { return <IconFrame><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function AttendanceIcon() { return <IconFrame><path d="M7 3v3M17 3v3M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="m8.5 15 2 2 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></IconFrame>; }
function TagIcon() { return <IconFrame><path d="M11.5 3H5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .59 1.41l8.5 8.5a2 2 0 0 0 2.82 0l6.5-6.5a2 2 0 0 0 0-2.82l-8.5-8.5A2 2 0 0 0 11.5 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /></IconFrame>; }
function ChartIcon() { return <IconFrame><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function GearIcon() { return <IconFrame><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconFrame>; }
function ArrowIcon() { return <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
