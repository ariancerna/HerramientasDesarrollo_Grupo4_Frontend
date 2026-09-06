import { MOCK_ANUNCIOS } from "@/lib/mock/anuncios.mock";
import { Anuncio, AnuncioFormData, EstadoAnuncio } from "@/types/anuncio";

const STORAGE_KEY = "kickstamp-anuncios";

function esNavegador() {
  return typeof window !== "undefined";
}

function crearId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function guardarAnuncios(anuncios: Anuncio[]) {
  if (esNavegador()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(anuncios));
  }
}

export function obtenerAnuncios(): Anuncio[] {
  if (!esNavegador()) return MOCK_ANUNCIOS;

  const almacenados = localStorage.getItem(STORAGE_KEY);
  if (!almacenados) {
    guardarAnuncios(MOCK_ANUNCIOS);
    return MOCK_ANUNCIOS;
  }

  try {
    const anuncios: unknown = JSON.parse(almacenados);
    return Array.isArray(anuncios) ? (anuncios as Anuncio[]) : MOCK_ANUNCIOS;
  } catch {
    return MOCK_ANUNCIOS;
  }
}

export function obtenerAnunciosPorProfesor(profesorId: string): Anuncio[] {
  return obtenerAnuncios()
    .filter((anuncio) => anuncio.profesorId === profesorId)
    .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));
}

export function crearAnuncio(
  data: AnuncioFormData,
  profesorId: string,
  estado: EstadoAnuncio,
): Anuncio {
  const nuevo: Anuncio = {
    ...data,
    id: crearId(),
    profesorId,
    fechaCreacion: new Date().toISOString(),
    estado,
  };
  guardarAnuncios([nuevo, ...obtenerAnuncios()]);
  return nuevo;
}

export function actualizarAnuncio(
  id: string,
  data: AnuncioFormData,
  estado: EstadoAnuncio,
): Anuncio | null {
  const anuncios = obtenerAnuncios();
  const indice = anuncios.findIndex((anuncio) => anuncio.id === id);
  if (indice === -1) return null;

  const actualizado: Anuncio = { ...anuncios[indice], ...data, estado };
  const nuevosAnuncios = [...anuncios];
  nuevosAnuncios[indice] = actualizado;
  guardarAnuncios(nuevosAnuncios);
  return actualizado;
}

export function eliminarAnuncio(id: string): void {
  guardarAnuncios(obtenerAnuncios().filter((anuncio) => anuncio.id !== id));
}

export function enviarAnuncio(id: string): Anuncio | null {
  const anuncio = obtenerAnuncios().find((actual) => actual.id === id);
  if (!anuncio) return null;

  return actualizarAnuncio(
    id,
    {
      titulo: anuncio.titulo,
      mensaje: anuncio.mensaje,
      destinatarios: anuncio.destinatarios,
      categoriaId: anuncio.categoriaId,
    },
    "enviado",
  );
}