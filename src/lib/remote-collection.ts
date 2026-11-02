import { useSyncExternalStore } from "react";
import { getTokens } from "@/lib/api";
import { isBrowser } from "@/lib/storage";

/** Se emite al iniciar o cerrar sesión (no en cada renovación de actividad). */
export const AUTH_CHANGE_EVENT = "kickstamp:auth-change";

export interface ColeccionRemota<T> {
  /** Snapshot actual; la primera lectura con sesión dispara la carga desde el API. */
  obtener: () => T[];
  /** Snapshot vacío y estable para el render del servidor. */
  obtenerInicial: () => T[];
  suscribir: (onStoreChange: () => void) => () => void;
  recargar: () => Promise<T[]>;
  /** Reemplaza la caché local tras una mutación confirmada por el API. */
  establecer: (items: T[]) => void;
}

/**
 * Caché en memoria de una colección del backend con la misma forma que los
 * stores de localStorage (obtener/suscribir), para que las páginas sigan
 * usando useSyncExternalStore. Se vacía al iniciar o cerrar sesión.
 */
export function crearColeccionRemota<T>(
  nombre: string,
  cargar: () => Promise<T[]>,
): ColeccionRemota<T> {
  const evento = `kickstamp:${nombre}-change`;
  const VACIO: T[] = [];
  let cache: T[] = VACIO;
  let estado: "pendiente" | "cargando" | "lista" | "error" = "pendiente";
  let peticion: Promise<T[]> | null = null;

  function notificar() {
    if (isBrowser()) window.dispatchEvent(new Event(evento));
  }

  function establecer(items: T[]) {
    cache = items;
    estado = "lista";
    notificar();
  }

  function recargar(): Promise<T[]> {
    estado = "cargando";
    const actual = cargar()
      .then((items) => {
        if (peticion === actual) establecer(items);
        return items;
      })
      .catch((error) => {
        if (peticion === actual) {
          estado = "error";
          console.error(`No se pudo cargar ${nombre}:`, error);
          notificar();
        }
        return cache;
      });
    peticion = actual;
    return actual;
  }

  function obtener(): T[] {
    if (isBrowser() && estado === "pendiente" && getTokens()) {
      void recargar();
    }
    return cache;
  }

  function suscribir(onStoreChange: () => void) {
    if (!isBrowser()) return () => undefined;
    window.addEventListener(evento, onStoreChange);
    return () => window.removeEventListener(evento, onStoreChange);
  }

  if (isBrowser()) {
    window.addEventListener(AUTH_CHANGE_EVENT, () => {
      // Otro usuario puede ver otros datos: se descarta lo cargado.
      peticion = null;
      cache = VACIO;
      estado = "pendiente";
      notificar();
    });
  }

  const obtenerInicial = () => VACIO;

  return {
    obtener,
    obtenerInicial,
    suscribir,
    recargar,
    establecer,
  };
}

/** Mantiene el componente sincronizado con la caché de la colección. */
export function useColeccion<T>(coleccion: ColeccionRemota<T>): T[] {
  return useSyncExternalStore(coleccion.suscribir, coleccion.obtener, coleccion.obtenerInicial);
}
