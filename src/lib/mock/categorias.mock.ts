import { Categoria } from "@/types";

// Datos de ejemplo. El módulo de administración de categorías (otra historia)
// eventualmente podría reemplazar esto por datos gestionados desde su propio store.
export const MOCK_CATEGORIAS: Categoria[] = [
  {
    id: "cat-sub10",
    nombre: "Sub-10",
    descripcion: "Categoría formativa mixta Sub-10",
    horarios: [
      { id: "h1", dia: "lunes", horaInicio: "09:00", horaFin: "11:00" },
      { id: "h2", dia: "miércoles", horaInicio: "09:00", horaFin: "11:00" },
      { id: "h3", dia: "viernes", horaInicio: "16:00", horaFin: "18:00" },
    ],
  },
  {
    id: "cat-sub12",
    nombre: "Sub-12",
    descripcion: "Categoría formativa mixta Sub-12",
    horarios: [
      { id: "h4", dia: "martes", horaInicio: "15:00", horaFin: "17:00" },
      { id: "h5", dia: "jueves", horaInicio: "15:00", horaFin: "17:00" },
    ],
  },
  {
    id: "cat-sub14",
    nombre: "Sub-14",
    descripcion: "Categoría formativa mixta Sub-14",
    horarios: [
      { id: "h6", dia: "lunes", horaInicio: "15:00", horaFin: "17:00" },
      { id: "h7", dia: "miércoles", horaInicio: "15:00", horaFin: "17:00" },
    ],
  },
  {
    id: "cat-sub17-fem",
    nombre: "Sub-17 femenino",
    descripcion: "Categoría competitiva Sub-17 rama femenina",
    horarios: [
      { id: "h8", dia: "martes", horaInicio: "17:00", horaFin: "19:00" },
      { id: "h9", dia: "jueves", horaInicio: "17:00", horaFin: "19:00" },
      { id: "h10", dia: "sábado", horaInicio: "09:00", horaFin: "11:00" },
    ],
  },
  {
    id: "cat-sub19-masc",
    nombre: "Sub-19 masculino",
    descripcion: "Categoría competitiva Sub-19 rama masculina",
    horarios: [
      { id: "h11", dia: "lunes", horaInicio: "17:00", horaFin: "19:00" },
      { id: "h12", dia: "miércoles", horaInicio: "17:00", horaFin: "19:00" },
      { id: "h13", dia: "viernes", horaInicio: "17:00", horaFin: "19:00" },
    ],
  },
  {
    id: "cat-mayores-fem",
    nombre: "Mayores femenino",
    descripcion: "Categoría libre o mayores rama femenina",
    horarios: [
      { id: "h14", dia: "martes", horaInicio: "19:00", horaFin: "21:00" },
      { id: "h15", dia: "jueves", horaInicio: "19:00", horaFin: "21:00" },
      { id: "h16", dia: "sábado", horaInicio: "11:00", horaFin: "13:00" },
    ],
  },
  {
    id: "cat-mayores-masc",
    nombre: "Mayores masculino",
    descripcion: "Categoría libre o mayores rama masculina",
    horarios: [
      { id: "h17", dia: "lunes", horaInicio: "19:00", horaFin: "21:00" },
      { id: "h18", dia: "miércoles", horaInicio: "19:00", horaFin: "21:00" },
      { id: "h19", dia: "viernes", horaInicio: "19:00", horaFin: "21:00" },
    ],
  },
];

export const NOMBRES_CATEGORIAS = MOCK_CATEGORIAS.map((c) => c.nombre);
