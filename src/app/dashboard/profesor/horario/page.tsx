"use client";

import { useEffect, useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import HorarioCard from "@/components/horarios/horario-card";
import { useAuth } from "@/hooks/use-auth";
import { suscribirCategorias } from "@/store/categorias-store";
import { obtenerHorariosPorProfesor } from "@/store/horarios-store";
import { DIAS_SEMANA, NOMBRES_DIAS, HorarioAsignado } from "@/types/horario";

export default function HorarioProfesorPage() {
  const { session } = useAuth();
  const [horarios, setHorarios] = useState<HorarioAsignado[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState("todos");

  useEffect(() => {
    const profesorId = session?.usuario.id;
    if (!profesorId) {
      setHorarios([]);
      return;
    }

    const actualizarHorarios = () => {
      setHorarios(obtenerHorariosPorProfesor(profesorId));
    };

    actualizarHorarios();
    return suscribirCategorias(actualizarHorarios);
  }, [session?.usuario.id]);

  const horariosFiltrados = useMemo(
    () =>
      diaSeleccionado === "todos"
        ? horarios
        : horarios.filter((horario) => horario.dia === diaSeleccionado),
    [diaSeleccionado, horarios],
  );

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">
              PROFESOR
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Mi horario
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulta los entrenamientos asignados a tus categorías.
            </p>
          </div>

          <label className="text-sm font-semibold text-slate-700">
            <span className="mr-2">Filtrar por día</span>
            <select
              value={diaSeleccionado}
              onChange={(event) => setDiaSeleccionado(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-800 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30"
            >
              <option value="todos">Todos los días</option>
              {DIAS_SEMANA.map((dia) => (
                <option key={dia} value={dia}>
                  {NOMBRES_DIAS[dia]}
                </option>
              ))}
            </select>
          </label>
        </header>

        {horariosFiltrados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No tienes entrenamientos asignados
            </h2>
            <p className="mt-2 text-sm text-slate-500">
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