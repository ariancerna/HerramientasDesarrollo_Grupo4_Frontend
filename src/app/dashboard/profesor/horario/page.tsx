"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import HorarioCard from "@/components/horarios/horario-card";
import HorarioFiltros from "@/components/horarios/horario-filtros";
import { useAuth } from "@/hooks/use-auth";
import {
  obtenerCategorias,
  obtenerCategoriasIniciales,
  suscribirCategorias,
} from "@/store/categorias-store";
import {
  filtrarHorariosPorDia,
  obtenerHorariosPorProfesor,
} from "@/store/horarios-store";
import { DIAS_SEMANA } from "@/types/horario";

export default function HorarioProfesorPage() {
  const { session } = useAuth();
  const categorias = useSyncExternalStore(
    suscribirCategorias,
    obtenerCategorias,
    obtenerCategoriasIniciales,
  );
  const [diaSeleccionado, setDiaSeleccionado] = useState("todos");
  const horarios = useMemo(
    () => obtenerHorariosPorProfesor(session?.usuario.id ?? "", categorias),
    [categorias, session?.usuario.id],
  );

  const horariosFiltrados = useMemo(() => {
    if (diaSeleccionado === "todos") return horarios;
    return filtrarHorariosPorDia(
      horarios,
      diaSeleccionado as (typeof DIAS_SEMANA)[number],
    );
  }, [diaSeleccionado, horarios]);

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">
              PROFESOR
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Mi horario
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Consulta los entrenamientos asignados a tus categorías.
            </p>
          </div>

          <HorarioFiltros dia={diaSeleccionado} onDiaChange={setDiaSeleccionado} />
        </header>

        {horariosFiltrados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No tienes entrenamientos asignados
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Cuando administración te asigne una categoría, sus horarios aparecerán aquí.
            </p>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Horarios asignados">
            {horariosFiltrados.map((horario) => (
              <HorarioCard key={`${horario.categoriaId}-${horario.id}`} horario={horario} />
            ))}
          </section>
        )}
      </div>
    </RoleGuard>
  );
}
