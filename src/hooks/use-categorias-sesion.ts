"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

// Categorías del usuario en sesión (GET /auth/me), guardadas por usuario para
// no repetir la consulta al cambiar de página.
const cache = new Map<string, string[]>();
const pendientes = new Set<string>();
const oyentes = new Set<() => void>();

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

function cargar(usuarioId: string) {
  if (cache.has(usuarioId) || pendientes.has(usuarioId)) return;
  pendientes.add(usuarioId);
  api<{ categorias?: string[] }>("/auth/me")
    .then((me) => {
      cache.set(usuarioId, me.categorias ?? []);
      oyentes.forEach((oyente) => oyente());
    })
    .catch(() => {
      // Sin categorías no se rompe nada: la tarjeta simplemente no se muestra.
    })
    .finally(() => pendientes.delete(usuarioId));
}

/** null mientras carga; [] si no tiene categorías asignadas. */
export function useCategoriasSesion(): string[] | null {
  const { session } = useAuth();
  const usuarioId = session?.usuario.id;

  useEffect(() => {
    if (usuarioId) cargar(usuarioId);
  }, [usuarioId]);

  return useSyncExternalStore(
    suscribir,
    () => (usuarioId ? cache.get(usuarioId) ?? null : null),
    () => null,
  );
}
