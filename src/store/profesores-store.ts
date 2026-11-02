import { DatosProfesor, Profesor } from "@/types";
import { api } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";
import { recargarCategorias } from "@/store/categorias-store";

interface ProfesorApi {
  id: string;
  nombre: string;
  usuario: string | null;
  email: string | null;
  sedeId: string | null;
}

function aProfesor(profesor: ProfesorApi): Profesor {
  return {
    id: profesor.id,
    nombre: profesor.nombre,
    usuario: profesor.usuario ?? "",
    email: profesor.email ?? "",
    sedeId: profesor.sedeId ?? undefined,
  };
}

const profesores = crearColeccionRemota<Profesor>("profesores", async () =>
  (await api<ProfesorApi[]>("/profesores")).map(aProfesor),
);

export const obtenerProfesoresIniciales = profesores.obtenerInicial;

// LEER
export const obtenerProfesores = profesores.obtener;
export const suscribirProfesores = profesores.suscribir;
export const useProfesores = () => useColeccion(profesores);

/** Verifica si un nombre de usuario ya está en uso (por otro profesor). */
export function usuarioProfesorDisponible(usuario: string, idAExcluir?: string): boolean {
  return !obtenerProfesores().some(
    (p) => p.usuario.toLowerCase() === usuario.toLowerCase() && p.id !== idAExcluir,
  );
}

// CREAR: el backend crea la cuenta de acceso, el perfil y sus categorías en una transacción.
export async function crearProfesor(datos: DatosProfesor, categoriaIds: string[]): Promise<void> {
  try {
    await api("/profesores", {
      method: "POST",
      body: {
        nombre: datos.nombre,
        usuario: datos.usuario,
        email: datos.email,
        password: datos.password,
        sedeId: datos.sedeId,
        categoriaIds,
      },
    });
  } finally {
    await Promise.all([profesores.recargar(), recargarCategorias()]);
  }
}

// ACTUALIZAR: perfil, categorías y (opcional) contraseña usan endpoints distintos.
export async function actualizarProfesor(
  id: string,
  datos: DatosProfesor,
  categoriaIds: string[],
): Promise<void> {
  try {
    await api(`/profesores/${id}`, {
      method: "PUT",
      body: { nombre: datos.nombre, usuario: datos.usuario, sedeId: datos.sedeId },
    });
    await api(`/profesores/${id}/categorias`, { method: "PUT", body: { categoriaIds } });
    if (datos.password) {
      await api(`/usuarios/${id}/reset-password`, {
        method: "POST",
        body: { nuevaPassword: datos.password },
      });
    }
  } finally {
    await Promise.all([profesores.recargar(), recargarCategorias()]);
  }
}

// ELIMINAR
export async function eliminarProfesor(id: string): Promise<void> {
  await api(`/profesores/${id}`, { method: "DELETE" });
  profesores.establecer(profesores.obtener().filter((p) => p.id !== id));
  await recargarCategorias();
}

/** Busca por nombre o usuario. */
export function filtrarProfesores(profesores: Profesor[], texto: string): Profesor[] {
  const termino = texto.trim().toLowerCase();
  if (!termino) return profesores;

  return profesores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(termino) || p.usuario.toLowerCase().includes(termino),
  );
}
