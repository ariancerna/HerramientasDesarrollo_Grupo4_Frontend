import { obtenerCategorias } from "@/store/categorias-store";
import type { ActividadCalendario, EventoClub } from "@/types/calendario";
import type { Horario } from "@/types";
import { api } from "@/lib/api";
import { crearColeccionRemota } from "@/lib/remote-collection";

/** Evento tal como lo devuelve /eventos (campos opcionales llegan como null). */
interface EventoApi extends Omit<EventoClub, "horaFin" | "categoria" | "descripcion"> {
  horaFin: string | null;
  categoria: string | null;
  descripcion: string | null;
}

function aEvento(evento: EventoApi): EventoClub {
  return {
    ...evento,
    horaFin: evento.horaFin ?? undefined,
    categoria: evento.categoria ?? undefined,
    descripcion: evento.descripcion ?? "",
  };
}

const eventos = crearColeccionRemota<EventoClub>("eventos", async () =>
  (await api<EventoApi[]>("/eventos")).map(aEvento),
);

export const obtenerEventosIniciales = eventos.obtenerInicial;

// LEER
export const obtenerEventos = eventos.obtener;
export const suscribirEventos = eventos.suscribir;

/** El API identifica la categoría por id; el formulario trabaja con su nombre. */
function cuerpoEvento(evento: Partial<EventoClub>) {
  const { categoria, ...resto } = evento;
  delete resto.id;
  delete (resto as { categoriaId?: string }).categoriaId;
  if (categoria === undefined) return resto;
  const categoriaId = obtenerCategorias().find((item) => item.nombre === categoria)?.id ?? null;
  return { ...resto, horaFin: resto.horaFin || null, categoriaId };
}

// CREAR — "programar horario/evento" (módulo de Calendario del admin)
export async function crearEvento(evento: Omit<EventoClub, "id">): Promise<EventoClub> {
  const nuevo = aEvento(
    await api<EventoApi>("/eventos", {
      method: "POST",
      body: cuerpoEvento({ ...evento, categoria: evento.categoria ?? "" }),
    }),
  );
  eventos.establecer([...eventos.obtener(), nuevo]);
  return nuevo;
}

// ACTUALIZAR
export async function actualizarEvento(id: string, cambios: Partial<EventoClub>): Promise<EventoClub> {
  const actualizado = aEvento(
    await api<EventoApi>(`/eventos/${id}`, {
      method: "PUT",
      body: cuerpoEvento({ ...cambios, categoria: cambios.categoria ?? "" }),
    }),
  );
  eventos.establecer(eventos.obtener().map((evento) => (evento.id === id ? actualizado : evento)));
  return actualizado;
}

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

  const eventos: ActividadCalendario[] = obtenerEventos().filter(
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

// ELIMINAR
export async function eliminarEvento(id: string): Promise<void> {
  await api(`/eventos/${id}`, { method: "DELETE" });
  eventos.establecer(eventos.obtener().filter((evento) => evento.id !== id));
}

export function obtenerProximasActividadesTodas(
  fechaReferencia = new Date(),
  limite = 30,
): ActividadCalendario[] {
  const categorias = obtenerCategorias();
  const actividadesPorCategoria = categorias.flatMap((categoria) =>
    obtenerProximasActividades(categoria.nombre, fechaReferencia, limite),
  );

  const vistos = new Set<string>();
  const combinadas = actividadesPorCategoria.filter((actividad) => {
    if (vistos.has(actividad.id)) return false;
    vistos.add(actividad.id);
    return true;
  });

  return combinadas
    .sort((a, b) =>
      fechaHoraComparable(a).localeCompare(fechaHoraComparable(b)),
    )
    .slice(0, limite);
}
