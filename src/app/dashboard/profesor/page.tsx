"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";

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

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
          <section className="relative overflow-hidden rounded-2xl bg-[#0A1628] px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-[#6FCF3A]" aria-hidden="true" />
            <div className="relative max-w-2xl">
              <p className="text-sm font-medium capitalize text-[#9adf76]">
                {fechaActual}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Hola, {primerNombre}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Desde aquí puedes registrar la asistencia del entrenamiento y consultar
                la información de tus alumnos.
              </p>
              <Link
                href="/dashboard/profesor/asistencia"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#6FCF3A] px-4 py-2.5 text-sm font-bold text-[#0A1628] transition hover:bg-[#7cdb4b] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0A1628]"
              >
                Registrar asistencia
                <ArrowIcon />
              </Link>
            </div>
          </section>

          <section className="mt-9" aria-labelledby="accesos-title">
            <div className="mb-4">
              <h2 id="accesos-title" className="text-xl font-bold text-[#0A1628]">
                Accesos principales
              </h2>
              <p className="mt-1 text-sm text-slate-500">
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
                    className="group flex min-h-44 flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#86c966] hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#edf8e8] text-[#16794C]">
                        <Icon />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-[#0A1628]">
                          {acceso.titulo}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                          {acceso.descripcion}
                        </p>
                      </div>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#16794C]">
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
