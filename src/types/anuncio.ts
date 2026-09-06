export type EstadoAnuncio = "borrador" | "enviado";

export interface Anuncio {
  id: string;
  profesorId: string;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  destinatarios: string[];
  categoriaId?: string;
  estado: EstadoAnuncio;
}

export type AnuncioFormData = Pick<
  Anuncio,
  "titulo" | "mensaje" | "destinatarios" | "categoriaId"
>;