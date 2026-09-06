import { Categoria } from "@/types";
import { MOCK_CATEGORIAS } from "@/lib/mock/categorias.mock";

const STORAGE_KEY = "kickstamp-categorias";
const CATEGORIAS_CHANGE_EVENT = "kickstamp:categorias-change";

let categoriasCache: Categoria[] | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function obtenerCategoriasIniciales(): Categoria[] {
  return MOCK_CATEGORIAS;
}

function restaurarCategorias(): Categoria[] {
  const categorias = [...MOCK_CATEGORIAS];
  categoriasCache = categorias;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
  return categorias;
}

// LEER
export function obtenerCategorias(): Categoria[] {
  if (!isBrowser()) return obtenerCategoriasIniciales();
  if (categoriasCache) return categoriasCache;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return restaurarCategorias();
  }

  try {
    const categorias: unknown = JSON.parse(raw);
    if (!Array.isArray(categorias)) return restaurarCategorias();

    categoriasCache = categorias as Categoria[];
    return categoriasCache;
  } catch {
    return restaurarCategorias();
  }
}

export function suscribirCategorias(onStoreChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const handleChange = () => {
    categoriasCache = null;
    onStoreChange();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) handleChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CATEGORIAS_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CATEGORIAS_CHANGE_EVENT, handleChange);
  };
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

  const actualizada = { ...categorias[index], ...cambios };
  guardarCategorias(
    categorias.map((categoria, indice) =>
      indice === index ? actualizada : categoria
    )
  );
  return actualizada;
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
  if (isBrowser()) {
    categoriasCache = categorias;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
    window.dispatchEvent(new Event(CATEGORIAS_CHANGE_EVENT));
  }
}
