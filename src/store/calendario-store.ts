import { MOCK_EVENTOS_CLUB } from "@/lib/mock/eventos.mock";
import { obtenerCategorias } from "@/store/categorias-store";
import type { ActividadCalendario } from "@/types/calendario";
import type { Horario } from "@/types";

const INDICE_DIA: Record<Horario["dia"], number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sábado: 6,
};

function fechaLocal(fecha: Date) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inicioDelDia(fecha: Date) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function fechaHoraComparable(actividad: ActividadCalendario) {
  return `${actividad.fecha}T${actividad.horaInicio}`;
}

export function obtenerProximasActividades(
  categoriaNombre: string,
  fechaReferencia = new Date(),
  limite = 12,
): ActividadCalendario[] {
  const hoy = inicioDelDia(fechaReferencia);
  const categoria = obtenerCategorias().find(
    (item) => item.nombre === categoriaNombre,
  );
  const entrenamientos: ActividadCalendario[] = [];

  if (categoria) {
    for (let desplazamiento = 0; desplazamiento <= 35; desplazamiento += 1) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + desplazamiento);

      for (const horario of categoria.horarios) {
        if (horario.estado === "cancelado") continue;
        if (INDICE_DIA[horario.dia] !== fecha.getDay()) continue;

        entrenamientos.push({
          id: `entrenamiento-${horario.id}-${fechaLocal(fecha)}`,
          tipo: "entrenamiento",
          titulo: "Entrenamiento",
          fecha: fechaLocal(fecha),
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          ubicacion: horario.cancha ?? "Cancha principal",
          categoria: categoria.nombre,
          descripcion: `Sesión regular de ${categoria.nombre}.`,
        });
      }
    }
  }

  const eventos: ActividadCalendario[] = MOCK_EVENTOS_CLUB.filter(
    (evento) => !evento.categoria || evento.categoria === categoriaNombre,
  )
    .filter((evento) => evento.fecha >= fechaLocal(hoy))
    .map((evento) => ({ ...evento, tipo: "evento" as const }));

  return [...entrenamientos, ...eventos]
    .sort((a, b) =>
      fechaHoraComparable(a).localeCompare(fechaHoraComparable(b)),
    )
    .slice(0, limite);
}
