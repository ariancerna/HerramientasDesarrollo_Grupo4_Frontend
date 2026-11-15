"use client";

import { Layers, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCategoriasSesion } from "@/hooks/use-categorias-sesion";

const MAXIMO_VISIBLES = 2;

/** Tarjeta al pie del menú lateral con la categoría del usuario (o acceso total del admin). */
export function TarjetaCategoria() {
  const { session } = useAuth();
  const categorias = useCategoriasSesion();
  const rol = session?.usuario.rol;
  if (!rol) return null;

  const esAdmin = rol === "administrador";
  const etiqueta = esAdmin ? "Acceso total" : categorias && categorias.length > 1 ? "Mis categorías" : "Mi categoría";
  const visibles = categorias?.slice(0, MAXIMO_VISIBLES) ?? [];
  const restantes = (categorias?.length ?? 0) - visibles.length;

  return (
    <div className="border-t border-sidebar-border p-3">
      <div
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3"
        title={!esAdmin && categorias?.length ? categorias.join(", ") : undefined}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-[0_6px_16px_-6px_rgb(37_99_235/0.9)]">
          {esAdmin ? <ShieldCheck className="h-[18px] w-[18px]" /> : <Layers className="h-[18px] w-[18px]" />}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-sidebar-muted">{etiqueta}</p>
          {esAdmin ? (
            <p className="mt-0.5 truncate text-[13px] font-semibold text-white">Todas las categorías</p>
          ) : categorias === null ? (
            <span className="mt-1.5 block h-3 w-28 animate-pulse rounded bg-white/10" aria-label="Cargando categoría" />
          ) : categorias.length === 0 ? (
            <p className="mt-0.5 truncate text-[13px] font-medium text-sidebar-text">Sin categoría asignada</p>
          ) : (
            <>
              {visibles.map((nombre) => (
                <p key={nombre} className="mt-0.5 truncate text-[13px] font-semibold text-white">
                  {nombre}
                </p>
              ))}
              {restantes > 0 && <p className="mt-0.5 text-[11px] font-medium text-blue-300">+{restantes} más</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
