export interface Categoria {
  id: string;
  nombre: string;
}

// Datos de ejemplo. El módulo de administración de categorías (otra historia)
// eventualmente podría reemplazar esto por datos gestionados desde su propio store.
export const MOCK_CATEGORIAS: Categoria[] = [
  { id: "cat-sub10", nombre: "Sub-10" },
  { id: "cat-sub12", nombre: "Sub-12" },
  { id: "cat-sub14", nombre: "Sub-14" },
  { id: "cat-sub17-fem", nombre: "Sub-17 femenino" },
  { id: "cat-sub19-masc", nombre: "Sub-19 masculino" },
  { id: "cat-mayores-fem", nombre: "Mayores femenino" },
  { id: "cat-mayores-masc", nombre: "Mayores masculino" },
];

export const NOMBRES_CATEGORIAS = MOCK_CATEGORIAS.map((c) => c.nombre);
