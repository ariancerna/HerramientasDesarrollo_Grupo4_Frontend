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
  return { dia, horaInicio, horaFin, cancha: cancha || null, estado: estado ?? "activo" };
}

/** El backend acepta los horarios en el mismo cuerpo; en la edición reemplazan la lista completa. */
function cuerpoCategoria(categoria: Partial<Categoria>) {
  return {
    nombre: categoria.nombre,
    descripcion: categoria.descripcion?.trim() || null,
    horarios: categoria.horarios?.map(datosHorario),
  };
}

// CREAR
export async function crearCategoria(categoria: Omit<Categoria, "id">): Promise<Categoria> {
  const nueva = aCategoria(
    await api<CategoriaApi>("/categorias", { method: "POST", body: cuerpoCategoria(categoria) }),
  );
  await categorias.recargar();
  return nueva;
}

// ACTUALIZAR
export async function actualizarCategoria(id: string, cambios: Partial<Categoria>): Promise<void> {
  try {
    await api(`/categorias/${id}`, { method: "PUT", body: cuerpoCategoria(cambios) });
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
