"use client";

import { useMemo, useState } from "react";
import AsistenciaTabla from "@/components/shared/asistencia-tabla";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerAsistenciasPorEstudiante } from "@/store/asistencia-store";

export default function HistorialAlumnoPage() {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [metodo, setMetodo] = useState<"todos" | "ESCANEO" | "MANUAL">(
    "todos",
  );
  const { session } = useAuth();
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId
    ? obtenerAlumnos().find((item) => item.id === estudianteId)
    : undefined;
  const registros = useMemo(
    () =>
      estudianteId
        ? [...obtenerAsistenciasPorEstudiante(estudianteId)].sort(
            (a, b) =>
              new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime(),
          )
        : [],
    [estudianteId],
  );
  const registrosFiltrados = useMemo(
    () =>
      registros.filter((registro) => {
        const fecha = registro.fechaHora.slice(0, 10);
        const coincideDesde = !fechaDesde || fecha >= fechaDesde;
        const coincideHasta = !fechaHasta || fecha <= fechaHasta;
        const coincideMetodo = metodo === "todos" || registro.metodo === metodo;

        return coincideDesde && coincideHasta && coincideMetodo;
      }),
    [fechaDesde, fechaHasta, metodo, registros],
  );
  const filtrosActivos = Boolean(fechaDesde || fechaHasta || metodo !== "todos");

  function limpiarFiltros() {
    setFechaDesde("");
    setFechaHasta("");
    setMetodo("todos");
  }

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
          <header className="mb-6">
            {/* ❌ Eliminado: <p>MI ESPACIO</p> */}
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Mi historial de asistencia
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {alumno
                ? `${alumno.nombres} ${alumno.apellidos} · ${alumno.categoria}`
                : "Consulta todas tus asistencias registradas."}
            </p>
          </header>

          {!estudianteId ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            >
              No se pudo identificar al alumno asociado a esta sesión.
            </div>
          ) : (
            <>
              <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Filtrar asistencias
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Busca tus registros por rango de fechas o método de registro.
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
                    <span className="font-bold text-slate-950 dark:text-white">
                      {registrosFiltrados.length}
                    </span>{" "}
                    de {registros.length} asistencias
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Desde
                    <input
                      type="date"
                      value={fechaDesde}
                      max={fechaHasta || undefined}
                      onChange={(event) => setFechaDesde(event.target.value)}
                      /* 🎨 CAMBIO: focus:border-[#16794C] focus:ring-[#16794C]/15 → focus:border-brand-green focus:ring-brand-green/15 */
                      className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hasta
                    <input
                      type="date"
                      value={fechaHasta}
                      min={fechaDesde || undefined}
                      onChange={(event) => setFechaHasta(event.target.value)}
                      /* 🎨 CAMBIO: focus:border-[#16794C] focus:ring-[#16794C]/15 → focus:border-brand-green focus:ring-brand-green/15 */
                      className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Método
                    <select
                      value={metodo}
                      onChange={(event) =>
                        setMetodo(
                          event.target.value as "todos" | "ESCANEO" | "MANUAL",
                        )
                      }
                      /* 🎨 CAMBIO: focus:border-[#16794C] focus:ring-[#16794C]/15 → focus:border-brand-green focus:ring-brand-green/15 */
                      className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="todos">Todos los métodos</option>
                      <option value="ESCANEO">Escaneo</option>
                      <option value="MANUAL">Registro manual</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    disabled={!filtrosActivos}
                    className="h-11 self-end rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Limpiar
                  </button>
                </div>
              </section>

              <AsistenciaTabla registros={registrosFiltrados} />
            </>
          )}
      </div>
    </RoleGuard>
  );
}