"use client";

import { IdCard, Lightbulb } from "lucide-react";
import { RoleGuard } from "@/components/shared/role-guard";
import { QrIngreso } from "@/components/shared/qr-ingreso";
import { useAuth } from "@/hooks/use-auth";
import { alumnosCargados, useAlumnos } from "@/store/alumnos-store";

const formatoFecha = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" });

/** "lunes, 2 de noviembre" → "Lunes, 2 de noviembre" (solo la primera letra en mayúscula). */
function fechaDeHoy() {
  const texto = formatoFecha.format(new Date());
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Acceso rápido del alumno a su QR de ingreso y a su DNI (respaldo si falla la cámara). */
export default function IngresoAlumnoPage() {
  const { session } = useAuth();
  const alumnos = useAlumnos();
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId ? alumnos.find((item) => item.id === estudianteId) : undefined;
  const nombre = alumno ? `${alumno.nombres} ${alumno.apellidos}` : session?.usuario.nombre ?? "";

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Mi QR de ingreso</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Muestra este código al profesor al llegar al entrenamiento para registrar tu asistencia.
          </p>
        </header>

        {!alumno ? (
          <p className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-body">
            {alumnosCargados() ? "No se encontró tu ficha de alumno. Comunícate con administración." : "Cargando tu código…"}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_17rem]">
            <section className="rounded-2xl border border-line bg-surface p-6 text-center shadow-sm sm:p-8">
              <p className="text-lg font-bold text-ink">{nombre}</p>
              <p className="mt-0.5 text-sm text-body">
                {alumno.categoria || "Sin categoría asignada"} ·{" "}
                <span className={alumno.estado === "activo" ? "font-semibold text-emerald-600 dark:text-emerald-400" : "font-semibold text-red-600 dark:text-red-400"}>
                  {alumno.estado === "activo" ? "Activo" : "Inactivo"}
                </span>
              </p>
              <div className="mt-6">
                <QrIngreso dni={alumno.dni} nombre={nombre} tamano={260} />
              </div>
              <p className="mt-4 text-xs text-muted">{fechaDeHoy()}</p>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <IdCard className="h-4 w-4 text-muted" /> Tu DNI
                </div>
                <p className="num mt-3 select-all text-center text-4xl font-bold tracking-[0.18em] text-ink">{alumno.dni}</p>
                <p className="mt-3 text-xs leading-5 text-body">
                  Si la cámara del profesor no lee el código, dicta este número para el registro manual.
                </p>
              </section>

              <section className="rounded-2xl bg-brand-green-soft p-5 text-sm text-ink">
                <div className="flex items-center gap-2 font-semibold">
                  <Lightbulb className="h-4 w-4 text-brand-green dark:text-brand-lime-light" /> Consejos
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-body">
                  <li>Sube el brillo de la pantalla antes de mostrar el código.</li>
                  <li>Descarga el QR para tenerlo a mano aunque no tengas internet.</li>
                  <li>Un registro por día: si ya marcaste asistencia, no es necesario repetirlo.</li>
                </ul>
              </section>
            </aside>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
