"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, BellRing, CheckCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDropdown } from "@/hooks/use-dropdown";
import { useSettings } from "@/hooks/use-settings";
import { permisoNotificaciones, reproducirSonidoNotificacion, solicitarPermisoNotificaciones } from "@/lib/avisos";
import {
  eliminarNotificacion,
  marcarNotificacionLeida,
  marcarTodasLeidas,
  useNotificaciones,
} from "@/store/notificaciones-store";

const formatoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function tiempoRelativo(fecha: string) {
  const minutos = Math.round((new Date(fecha).getTime() - Date.now()) / 60_000);
  if (Math.abs(minutos) < 60) return formatoRelativo.format(minutos, "minute");
  const horas = Math.round(minutos / 60);
  if (Math.abs(horas) < 24) return formatoRelativo.format(horas, "hour");
  return formatoRelativo.format(Math.round(horas / 24), "day");
}

/** Campana con las notificaciones reales del usuario (GET /me/notificaciones). */
export default function NotificationBell() {
  const { session } = useAuth();
  const { settings } = useSettings();
  const { ref, abierto, setAbierto, alternar } = useDropdown();
  const notificaciones = useNotificaciones({ silenciadas: settings.notificacionesSilenciadas });
  const [permiso, setPermiso] = useState(permisoNotificaciones);

  if (!session) return null;

  const noLeidas = notificaciones.filter((item) => !item.leida).length;
  const contador = settings.notificacionesSilenciadas ? 0 : noLeidas;

  const activarAvisos = async () => {
    setPermiso(await solicitarPermisoNotificaciones());
    reproducirSonidoNotificacion();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={alternar}
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        aria-label={contador > 0 ? `Notificaciones (${contador} sin leer)` : "Notificaciones"}
        aria-expanded={abierto}
      >
        <Bell className="h-[18px] w-[18px]" />
        {contador > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-surface">
            {contador > 9 ? "9+" : contador}
          </span>
        )}
      </button>

      {abierto && (
        <div className="fixed right-3 top-[calc(env(safe-area-inset-top)+4rem)] z-50 w-[calc(100vw-1.5rem)] max-w-sm animate-fade-up overflow-hidden rounded-xl border border-line bg-surface shadow-[0_16px_40px_-12px_rgb(15_27_51/0.3)] sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-bold text-ink">Notificaciones</p>
              <p className="text-xs text-muted">
                {noLeidas === 0 ? "Estás al día" : noLeidas === 1 ? "1 sin leer" : `${noLeidas} sin leer`}
              </p>
            </div>
            {noLeidas > 0 && (
              <button
                type="button"
                onClick={() => void marcarTodasLeidas()}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-primary-light hover:bg-surface-muted dark:text-blue-300"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Marcar todas como leídas
              </button>
            )}
          </div>

          {permiso === "default" && (
            <button
              type="button"
              onClick={() => void activarAvisos()}
              className="flex w-full items-center gap-3 border-b border-line bg-primary-soft px-4 py-2.5 text-left text-xs font-medium text-primary hover:opacity-90 dark:text-blue-200"
            >
              <BellRing className="h-4 w-4 shrink-0" />
              Activa los avisos del navegador para enterarte aunque la aplicación esté en segundo plano.
            </button>
          )}

          <ul className="max-h-[min(420px,60vh)] divide-y divide-line overflow-y-auto">
            {notificaciones.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-muted">No tienes notificaciones.</li>
            ) : (
              notificaciones.map((item) => (
                <li key={item.id} className={`group relative flex gap-3 px-4 py-3 transition-colors hover:bg-surface-muted ${item.leida ? "" : "bg-primary-soft/40"}`}>
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.leida ? "bg-transparent" : "bg-blue-500"}`} />
                  <Link
                    href={item.href ?? "#"}
                    onClick={() => {
                      if (!item.leida) void marcarNotificacionLeida(item.id);
                      setAbierto(false);
                    }}
                    className="min-w-0 flex-1"
                  >
                    <p className={`text-sm text-ink ${item.leida ? "font-medium" : "font-semibold"}`}>{item.titulo}</p>
                    {item.descripcion && <p className="mt-0.5 line-clamp-2 text-xs text-body">{item.descripcion}</p>}
                    <p className="mt-1 text-[11px] text-muted">{tiempoRelativo(item.creadaEn)}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => void eliminarNotificacion(item.id)}
                    aria-label={`Eliminar notificación: ${item.titulo}`}
                    className="self-start rounded-md p-1.5 text-muted opacity-0 transition hover:bg-surface hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
