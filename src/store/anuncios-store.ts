import { Anuncio, AnuncioFormData, EstadoAnuncio } from "@/types/anuncio";
import { api, apiTodasLasPaginas } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";
import { getSession } from "@/store/auth-store";

/** Anuncio tal como lo devuelve el backend (en /me/anuncios no trae destinatarios). */
interface AnuncioApi extends Omit<Anuncio, "categoriaId" | "destinatarios"> {
  categoriaId: string | null;
  destinatarios?: string[];
}

function aAnuncio(anuncio: AnuncioApi, destinatariosPorDefecto: string[] = []): Anuncio {
  return {
    id: anuncio.id,
    profesorId: anuncio.profesorId,
    titulo: anuncio.titulo,
    mensaje: anuncio.mensaje,
    fechaCreacion: anuncio.fechaCreacion,
    estado: anuncio.estado,
    categoriaId: anuncio.categoriaId ?? undefined,
    destinatarios: anuncio.destinatarios ?? destinatariosPorDefecto,
  };
}

// El profesor gestiona los suyos en /anuncios; el alumno recibe los enviados a él en /me/anuncios.
const anuncios = crearColeccionRemota<Anuncio>("anuncios", async () => {
  const usuario = getSession()?.usuario;
  if (usuario?.rol === "alumno") {
    const propios = usuario.estudianteId ? [usuario.estudianteId] : [];
    return (await api<AnuncioApi[]>("/me/anuncios?limite=100")).map((anuncio) => aAnuncio(anuncio, propios));
  }
  if (usuario?.rol === "profesor") {
    return (await apiTodasLasPaginas<AnuncioApi>("/anuncios")).map((anuncio) => aAnuncio(anuncio));
  }
  return [];
});

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
  const nuevo = aAnuncio(await api<AnuncioApi>("/anuncios", { method: "POST", body: cuerpoAnuncio(data, estado) }));
  anuncios.establecer([nuevo, ...obtenerAnuncios()]);
  return nuevo;
}

export async function actualizarAnuncio(
  id: string,
  data: AnuncioFormData,
  estado: EstadoAnuncio,
): Promise<Anuncio> {
  const actualizado = aAnuncio(
    await api<AnuncioApi>(`/anuncios/${id}`, { method: "PUT", body: cuerpoAnuncio(data, estado) }),
  );
  anuncios.establecer(obtenerAnuncios().map((anuncio) => (anuncio.id === id ? actualizado : anuncio)));
  return actualizado;
}

export async function eliminarAnuncio(id: string): Promise<void> {
  await api(`/anuncios/${id}`, { method: "DELETE" });
  anuncios.establecer(obtenerAnuncios().filter((anuncio) => anuncio.id !== id));
}

/** Pasa un borrador a enviado; el backend genera las notificaciones de los alumnos. */
export async function enviarAnuncio(id: string): Promise<Anuncio> {
  const enviado = aAnuncio(await api<AnuncioApi>(`/anuncios/${id}/enviar`, { method: "POST" }));
  anuncios.establecer(obtenerAnuncios().map((anuncio) => (anuncio.id === id ? enviado : anuncio)));
  return enviado;
}
