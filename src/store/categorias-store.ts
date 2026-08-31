import { Categoria } from "@/types";
import { MOCK_CATEGORIAS } from "@/lib/mock/categorias.mock";

const STORAGE_KEY = "kickstamp-categorias";

// LEER
export function obtenerCategorias(): Categoria[] {
  if (typeof window === "undefined") return MOCK_CATEGORIAS;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CATEGORIAS));
    return MOCK_CATEGORIAS;
  }
  return JSON.parse(raw);
}

// CREAR
export function crearCategoria(categoria: Omit<Categoria, "id">): Categoria {
  const nueva: Categoria = { ...categoria, id: crypto.randomUUID() };
  const todas = obtenerCategorias();
  guardarCategorias([...todas, nueva]);
  return nueva;
}

// ACTUALIZAR
export function actualizarCategoria(
  id: string,
  cambios: Partial<Categoria>
): Categoria | null {
  const categorias = obtenerCategorias();
  const index = categorias.findIndex((c) => c.id === id);
  if (index === -1) return null;

  categorias[index] = { ...categorias[index], ...cambios };
  guardarCategorias(categorias);
  return categorias[index];
}

// ELIMINAR
export function eliminarCategoria(id: string): boolean {
  const categorias = obtenerCategorias();
  const nuevas = categorias.filter((c) => c.id !== id);
  if (nuevas.length === categorias.length) return false;

  guardarCategorias(nuevas);
  return true;
}

function guardarCategorias(categorias: Categoria[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
  }
}