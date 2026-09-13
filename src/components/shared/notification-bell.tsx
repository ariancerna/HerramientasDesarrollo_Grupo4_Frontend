"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import type { Role } from "@/types";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  href: string;
}

const NOTIFICACIONES_POR_ROL: Record<Role, NotificationItem[]> = {
  administrador: [
    {
      id: "adm-1",
      title: "Nuevo alumno registrado",
      description: "Se agregó un alumno nuevo al padrón del club.",
      time: "Hace 2 h",
      href: "/dashboard/admin/alumnos",
    },
    {
      id: "adm-2",
      title: "Categoría sin horarios",
      description: "Revisa las categorías que aún no tienen horarios configurados.",
      time: "Hace 5 h",
      href: "/dashboard/admin/categorias",
    },
    {
      id: "adm-3",
      title: "Reporte semanal disponible",
      description: "Ya puedes generar el reporte de asistencia de esta semana.",
      time: "Ayer",
      href: "/dashboard/admin/reportes",
    },
  ],
  profesor: [
    {
      id: "prof-1",
      title: "Registra la asistencia de hoy",
      description: "Aún no hay registros de asistencia para el entrenamiento de hoy.",
      time: "Hace 1 h",
      href: "/dashboard/profesor/asistencia",
    },
    {
      id: "prof-2",
      title: "Nuevo alumno en tu categoría",
      description: "Se incorporó un alumno nuevo a uno de tus grupos.",
      time: "Ayer",
      href: "/dashboard/profesor/alumnos",
    },
  ],
  alumno: [
    {
      id: "alu-1",
      title: "Próximo entrenamiento",
      description: "Tu próxima clase está programada según tu categoría.",
      time: "Hace 3 h",
      href: "/dashboard/alumno/calendario",
    },
    {
      id: "alu-2",
      title: "Asistencia registrada",
      description: "Se registró tu asistencia del último entrenamiento.",
      time: "Ayer",
      href: "/dashboard/alumno/historial",
    },
  ],
};

export default function NotificationBell() {
  const { session } = useAuth();
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(
    () => (session ? NOTIFICACIONES_POR_ROL[session.usuario.rol] : []),
    [session],
  );
  const unreadCount = settings.notificacionesSilenciadas
    ? 0
    : notifications.filter((item) => !readIds.has(item.id)).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const marcarTodasLeidas = () => {
    setReadIds(new Set(notifications.map((item) => item.id)));
  };

  const marcarLeida = (id: string) => {
    setReadIds((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
  };

  if (!session) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label={unreadCount > 0 ? `Notificaciones (${unreadCount} sin leer)` : "Notificaciones"}
        aria-expanded={isOpen}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-[calc(env(safe-area-inset-top)+4rem)] z-40 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Notificaciones</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={marcarTodasLeidas}
                className="text-xs font-semibold text-primary-dark hover:text-primary-hover dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {settings.notificacionesSilenciadas && (
            <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              Las notificaciones están silenciadas. Actívalas en Configuración.
            </p>
          )}

          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
              No tienes notificaciones.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {notifications.map((notification) => {
                const isUnread = !readIds.has(notification.id);
                return (
                  <li key={notification.id}>
                    <Link
                      href={notification.href}
                      onClick={() => {
                        marcarLeida(notification.id);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-start gap-2.5 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          isUnread ? "bg-primary" : "bg-transparent"
                        }`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {notification.description}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{notification.time}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
