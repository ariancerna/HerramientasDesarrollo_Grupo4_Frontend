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
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const notifications = useMemo(
    () => (session ? NOTIFICACIONES_POR_ROL[session.usuario.rol] : []),
    [session],
  );
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const visibleNotifications = notifications.filter((item) => !dismissedIds.has(item.id));

  const unreadCount = settings.notificacionesSilenciadas
    ? 0
    : visibleNotifications.filter((item) => !readIds.has(item.id)).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setDeleteId(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setDeleteId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const marcarTodasLeidas = () => {
    setReadIds(new Set(visibleNotifications.map((item) => item.id)));
  };

  const marcarLeida = (id: string) => {
    setReadIds((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
  };

  const eliminarNotificacion = (id: string) => {
    setDismissedIds((current) => new Set(current).add(id));
    setDeleteId(null);
  };

  if (!session) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-green/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label={unreadCount > 0 ? `Notificaciones (${unreadCount} sin leer)` : "Notificaciones"}
        aria-expanded={isOpen}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed right-3 top-[calc(env(safe-area-inset-top)+4rem)] z-40 max-h-[70vh] w-[85vw] max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900/60 dark:text-sky-300">
                <BellIcon />
              </span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">Notificaciones</p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={marcarTodasLeidas}
                className="shrink-0 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          {settings.notificacionesSilenciadas && (
            <p className="border-b border-amber-200 bg-amber-50 px-5 py-2.5 text-xs font-medium text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
              Las notificaciones están silenciadas. Actívalas en Configuración.
            </p>
          )}

          <div className="max-h-[min(420px,calc(70vh-4rem))] overflow-y-auto p-3">
            {visibleNotifications.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500 dark:bg-slate-700/40 dark:text-slate-400">
                No tienes notificaciones.
              </p>
            ) : (
              <div className="space-y-2">
                {visibleNotifications.map((notification) => {
                  const isUnread = !readIds.has(notification.id);
                  const isConfirmingDelete = deleteId === notification.id;

                  return (
                    <div
                      key={notification.id}
                      className={`rounded-xl border p-3 transition ${
                        isUnread
                          ? "border-sky-100 bg-sky-50/60 dark:border-sky-900/50 dark:bg-sky-950/40"
                          : "border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800"
                      }`}
                    >
                      <Link
                        href={notification.href}
                        onClick={() => {
                          marcarLeida(notification.id);
                          setIsOpen(false);
                        }}
                        className="block"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            {isUnread && (
                              <span
                                className="h-2 w-2 shrink-0 rounded-full bg-sky-400 dark:bg-sky-400"
                                aria-hidden="true"
                              />
                            )}
                            {notification.title}
                          </p>
                          <span className="shrink-0 text-xs font-semibold text-slate-400 dark:text-slate-400">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mt-1 pl-0 text-xs leading-5 text-slate-500 dark:text-slate-300">
                          {notification.description}
                        </p>
                      </Link>

                      <div className="mt-3 flex flex-nowrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-700">
                        {isUnread ? (
                          <button
                            type="button"
                            onClick={() => marcarLeida(notification.id)}
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-sky-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-sky-600 transition hover:bg-sky-50 dark:border-sky-800 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-sky-950/40 sm:px-2.5 sm:text-xs"
                          >
                            <CheckIcon />
                            Marcar como visto
                          </button>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300 sm:px-2.5 sm:text-xs">
                            <CheckAllIcon />
                            Vista
                          </span>
                        )}

                        {isConfirmingDelete ? (
                          <div className="flex flex-nowrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => eliminarNotificacion(notification.id)}
                              className="shrink-0 whitespace-nowrap rounded-lg bg-red-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:opacity-90 sm:text-xs"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(null)}
                              className="shrink-0 whitespace-nowrap rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 sm:text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteId(notification.id)}
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-red-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40 sm:px-2.5 sm:text-xs"
                          >
                            <TrashIcon />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckAllIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path d="m2 12 5 5L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 5 5L24 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}