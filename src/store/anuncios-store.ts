import { Anuncio, AnuncioFormData, EstadoAnuncio } from "@/types/anuncio";
import { api } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";

// El backend responde con el formato de Anuncio y ya filtra por rol
// (el profesor recibe los suyos; el alumno, los enviados a él).
const anuncios = crearColeccionRemota<Anuncio>("anuncios", () => api<Anuncio[]>("/anuncios"));

export const useAnuncios = () => useColeccion(anuncios);

export function obtenerAnuncios(): Anuncio[] {
  return anuncios.obtener();
}

export function obtenerAnunciosPorProfesor(profesorId: string): Anuncio[] {
  return obtenerAnuncios()
    .filter((anuncio) => anuncio.profesorId === profesorId)
    .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));
}

function cuerpoAnuncio(data: AnuncioFormData, estado: EstadoAnuncio) {
  return {
    titulo: data.titulo,
    mensaje: data.mensaje,
    destinatarios: data.destinatarios,
    categoriaId: data.categoriaId || null,
    estado,
  };
}

/** El profesor se toma del token en el backend. */
export async function crearAnuncio(data: AnuncioFormData, estado: EstadoAnuncio): Promise<Anuncio> {
  const nuevo = await api<Anuncio>("/anuncios", { method: "POST", body: cuerpoAnuncio(data, estado) });
  anuncios.establecer([nuevo, ...obtenerAnuncios()]);
  return nuevo;
}

export async function actualizarAnuncio(
  id: string,
  data: AnuncioFormData,
  estado: EstadoAnuncio,
): Promise<Anuncio> {
  const actualizado = await api<Anuncio>(`/anuncios/${id}`, {
    method: "PUT",
    body: cuerpoAnuncio(data, estado),
  });
  anuncios.establecer(obtenerAnuncios().map((anuncio) => (anuncio.id === id ? actualizado : anuncio)));
  return actualizado;
}

export async function eliminarAnuncio(id: string): Promise<void> {
  await api(`/anuncios/${id}`, { method: "DELETE" });
  anuncios.establecer(obtenerAnuncios().filter((anuncio) => anuncio.id !== id));
}

export async function enviarAnuncio(id: string): Promise<Anuncio | null> {
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
