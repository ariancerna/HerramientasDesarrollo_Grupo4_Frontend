import { obtenerCategorias } from "@/store/categorias-store";
import { Categoria } from "@/types";
import { DIAS_SEMANA, HorarioAsignado } from "@/types/horario";

export function obtenerHorariosPorProfesor(
  profesorId: string,
  categorias: Categoria[] = obtenerCategorias(),
): HorarioAsignado[] {
  if (!profesorId) return [];

  return categorias
    .filter((categoria) => categoria.profesorIds?.includes(profesorId))
    .flatMap((categoria) =>
      categoria.horarios.map((horario) => ({
        ...horario,
        categoriaId: categoria.id,
        categoria: categoria.nombre,
        profesorId,
        estado: horario.estado ?? "activo",
      })),
    )
    .sort((a, b) => {
      const dia = DIAS_SEMANA.indexOf(a.dia) - DIAS_SEMANA.indexOf(b.dia);
      return dia || a.horaInicio.localeCompare(b.horaInicio);
    });
}

export function filtrarHorariosPorDia(
  horarios: HorarioAsignado[],
  dia: HorarioAsignado["dia"] | "todos",
): HorarioAsignado[] {
  if (dia === "todos") return horarios;
  return horarios.filter((horario) => horario.dia === dia);
}