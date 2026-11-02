import { Sede } from "@/types";
import { api } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";

interface SedeApi {
  id: string;
  nombre: string;
  direccion?: string | null;
}

function aSede(sede: SedeApi): Sede {
  return { id: sede.id, nombre: sede.nombre, direccion: sede.direccion ?? undefined };
}

const sedes = crearColeccionRemota<Sede>("sedes", async () =>
  (await api<SedeApi[]>("/sedes")).map(aSede),
);

export const obtenerSedesIniciales = sedes.obtenerInicial;

// LEER
export const obtenerSedes = sedes.obtener;
export const suscribirSedes = sedes.suscribir;
export const useSedes = () => useColeccion(sedes);

// CREAR
export async function crearSede(sede: Omit<Sede, "id">): Promise<Sede> {
  const nueva = aSede(await api<SedeApi>("/sedes", { method: "POST", body: sede }));
  sedes.establecer([...sedes.obtener(), nueva]);
  return nueva;
}

// ACTUALIZAR
export async function actualizarSede(id: string, cambios: Partial<Sede>): Promise<Sede> {
  const { nombre, direccion } = cambios;
  const actualizada = aSede(
    await api<SedeApi>(`/sedes/${id}`, { method: "PUT", body: { nombre, direccion } }),
  );
  sedes.establecer(sedes.obtener().map((sede) => (sede.id === id ? actualizada : sede)));
  return actualizada;
}

// ELIMINAR
export async function eliminarSede(id: string): Promise<void> {
  await api(`/sedes/${id}`, { method: "DELETE" });
  sedes.establecer(sedes.obtener().filter((sede) => sede.id !== id));
}
