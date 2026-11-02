import { useMemo } from "react";
import { Categoria, Horario } from "@/types";
import { api } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";

interface CategoriaApi extends Omit<Categoria, "descripcion" | "horarios"> {
  descripcion: string | null;
  horarios: (Omit<Horario, "cancha"> & { cancha: string | null })[];
}

// GET /categorias ya trae profesorIds y horarios; solo se cambian null por undefined.
function aCategoria(categoria: CategoriaApi): Categoria {
  return {
    ...categoria,
    descripcion: categoria.descripcion ?? undefined,
    profesorIds: categoria.profesorIds ?? [],
    horarios: categoria.horarios.map((horario) => ({
      ...horario,
      cancha: horario.cancha ?? undefined,
      estado: horario.estado ?? "activo",
    })),
  };
}

const categorias = crearColeccionRemota<Categoria>("categorias", async () =>
  (await api<CategoriaApi[]>("/categorias")).map(aCategoria),
);

export const obtenerCategoriasIniciales = categorias.obtenerInicial;

// LEER
export const obtenerCategorias = categorias.obtener;
export const suscribirCategorias = categorias.suscribir;
export const recargarCategorias = categorias.recargar;
export const useCategorias = () => useColeccion(categorias);

/** Nombres de las categorías registradas, para selects y filtros. */
export function useNombresCategorias(): string[] {
  const lista = useCategorias();
  return useMemo(() => lista.map((categoria) => categoria.nombre), [lista]);
}

function datosHorario({ dia, horaInicio, horaFin, cancha, estado }: Horario) {
  return { dia, horaInicio, horaFin, cancha: cancha || undefined, estado };
}

function horarioCambio(antes: Horario, despues: Horario) {
  return (
    antes.dia !== despues.dia ||
    antes.horaInicio !== despues.horaInicio ||
    antes.horaFin !== despues.horaFin ||
    (antes.cancha ?? "") !== (despues.cancha ?? "") ||
    (antes.estado ?? "activo") !== (despues.estado ?? "activo")
  );
}

/**
 * Los horarios se gestionan con sus propios endpoints: primero se eliminan
 * los quitados (libera sus días), luego se editan y al final se crean los nuevos.
 */
async function sincronizarHorarios(categoriaId: string, anteriores: Horario[], nuevos: Horario[]) {
  const base = `/categorias/${categoriaId}/horarios`;
  const idsNuevos = new Set(nuevos.map((horario) => horario.id));
  const porId = new Map(anteriores.map((horario) => [horario.id, horario]));

  for (const horario of anteriores) {
    if (!idsNuevos.has(horario.id)) {
      await api(`${base}/${horario.id}`, { method: "DELETE" });
    }
  }
  for (const horario of nuevos) {
    const anterior = porId.get(horario.id);
    if (anterior && horarioCambio(anterior, horario)) {
      await api(`${base}/${horario.id}`, { method: "PUT", body: datosHorario(horario) });
    }
  }
  for (const horario of nuevos) {
    if (!porId.has(horario.id)) {
      await api(base, { method: "POST", body: datosHorario(horario) });
    }
  }
}

// CREAR
export async function crearCategoria(categoria: Omit<Categoria, "id">): Promise<Categoria> {
  const nueva = aCategoria(
    await api<CategoriaApi>("/categorias", {
      method: "POST",
      body: { nombre: categoria.nombre, descripcion: categoria.descripcion || undefined },
    }),
  );
  try {
    await sincronizarHorarios(nueva.id, [], categoria.horarios);
  } finally {
    await categorias.recargar();
  }
  return nueva;
}

// ACTUALIZAR
export async function actualizarCategoria(
  id: string,
  cambios: Partial<Categoria>,
): Promise<void> {
  const actual = categorias.obtener().find((categoria) => categoria.id === id);
  try {
    if (cambios.nombre !== undefined || cambios.descripcion !== undefined) {
      await api(`/categorias/${id}`, {
        method: "PUT",
        body: { nombre: cambios.nombre, descripcion: cambios.descripcion ?? "" },
      });
    }
    if (cambios.horarios) {
      await sincronizarHorarios(id, actual?.horarios ?? [], cambios.horarios);
    }
  } finally {
    await categorias.recargar();
  }
}

// ELIMINAR
export async function eliminarCategoria(id: string): Promise<void> {
  await api(`/categorias/${id}`, { method: "DELETE" });
  categorias.establecer(categorias.obtener().filter((categoria) => categoria.id !== id));
}

/** Sincroniza las categorías asignadas a un profesor. */
export async function asignarCategoriasAProfesor(profesorId: string, categoriaIds: string[]) {
  try {
    await api(`/profesores/${profesorId}/categorias`, {
      method: "PUT",
      body: { categoriaIds },
    });
  } finally {
    await categorias.recargar();
  }
}
