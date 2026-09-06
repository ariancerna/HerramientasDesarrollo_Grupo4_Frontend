import { obtenerCategorias } from "@/store/categorias-store";
import { DIAS_SEMANA, HorarioAsignado } from "@/types/horario";

export function obtenerHorariosPorProfesor(profesorId: string): HorarioAsignado[] {
  if (!profesorId) return [];

  return obtenerCategorias()
    .filter((categoria) => categoria.profesorIds?.includes(profesorId))
    .flatMap((categoria) =>
      categoria.horarios.map((horario) => ({
        ...horario,
        categoriaId: categoria.id,
        categoria: categoria.nombre,
        profesorId,
      })),
    )
    .sort((a, b) => {
      const dia = DIAS_SEMANA.indexOf(a.dia) - DIAS_SEMANA.indexOf(b.dia);
      return dia || a.horaInicio.localeCompare(b.horaInicio);
    });
}