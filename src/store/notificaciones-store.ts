import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { mostrarNotificacionSistema, reproducirSonidoNotificacion } from "@/lib/avisos";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";

/** Notificación generada por el servidor (anuncio enviado, asistencia o pago registrado). */
export interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string | null;
  href: string | null;
  leida: boolean;
  creadaEn: string;
}

const INTERVALO_MS = 30_000;

const notificaciones = crearColeccionRemota<Notificacion>("notificaciones", () =>
  api<Notificacion[]>("/me/notificaciones?limit=30"),
);

export const recargarNotificaciones = notificaciones.recargar;

/**
 * Lista de notificaciones que se actualiza sola cada 30 segundos. Cuando llega
 * una nueva no leída, suena un aviso y se muestra una notificación del sistema.
 */
export function useNotificaciones({ silenciadas }: { silenciadas: boolean }) {
  const lista = useColeccion(notificaciones);
  const conocidas = useRef<Set<string> | null>(null);

  useEffect(() => {
    const intervalo = window.setInterval(() => void notificaciones.recargar(), INTERVALO_MS);
    const alVolver = () => document.visibilityState === "visible" && void notificaciones.recargar();
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, []);

  useEffect(() => {
    if (!notificaciones.cargada()) return;
    // La primera carga solo registra lo existente: no se avisa de notificaciones antiguas.
    if (!conocidas.current) {
      conocidas.current = new Set(lista.map((item) => item.id));
      return;
    }
    const nuevas = lista.filter((item) => !item.leida && !conocidas.current!.has(item.id));
    lista.forEach((item) => conocidas.current!.add(item.id));
    if (nuevas.length === 0 || silenciadas) return;

    reproducirSonidoNotificacion();
    if (document.visibilityState === "hidden") {
      const [primera] = nuevas;
      void mostrarNotificacionSistema(
        nuevas.length === 1 ? primera.titulo : `Tienes ${nuevas.length} notificaciones nuevas`,
        primera.descripcion ?? "Abre El Golazo Club para ver el detalle.",
        primera.href ?? "/",
      );
    }
  }, [lista, silenciadas]);

  return lista;
}

export async function marcarNotificacionLeida(id: string) {
  notificaciones.establecer(
    notificaciones.obtener().map((item) => (item.id === id ? { ...item, leida: true } : item)),
  );
  await api(`/me/notificaciones/${id}/leida`, { method: "PATCH" }).catch(() => notificaciones.recargar());
}

export async function marcarTodasLeidas() {
  notificaciones.establecer(notificaciones.obtener().map((item) => ({ ...item, leida: true })));
  await api("/me/notificaciones/leer-todas", { method: "POST" }).catch(() => notificaciones.recargar());
}

export async function eliminarNotificacion(id: string) {
  notificaciones.establecer(notificaciones.obtener().filter((item) => item.id !== id));
  await api(`/me/notificaciones/${id}`, { method: "DELETE" }).catch(() => notificaciones.recargar());
}
