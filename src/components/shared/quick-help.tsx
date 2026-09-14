"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { NAV_ITEMS, NavIcon } from "@/constants/nav-items";
import { useAuth } from "@/hooks/use-auth";

const HELP_DESCRIPTIONS: Record<string, string> = {
  Alumnos: "Gestiona y consulta a tus alumnos.",
  Profesores: "Crea cuentas y asigna categorías.",
  Asistencia: "Registra y revisa asistencias.",
  Pagos: "Consulta pagos y mensualidades.",
  Calendario: "Revisa actividades y horarios.",
  Categorías: "Administra categorías y horarios.",
  Sedes: "Gestiona las sedes del club.",
  Reportes: "Genera reportes de asistencia.",
  "Mi perfil": "Actualiza tus datos personales.",
  "Mi historial": "Consulta tus asistencias.",
  "Mi horario": "Consulta tus entrenamientos.",
  Evaluaciones: "Registra el rendimiento de alumnos.",
  Anuncios: "Envía avisos a tus alumnos.",
  Configuración: "Ajusta las preferencias del panel.",
};

export default function QuickHelp() {
  const { session } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const items = useMemo(
    () => (session ? NAV_ITEMS[session.usuario.rol].slice(1) : []),
    [session],
  );

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-green/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="Ayuda rápida"
        aria-expanded={isOpen}
        aria-controls="quick-help-menu"
      >
        <HelpIcon />
      </button>

      {isOpen && (
        <section
          id="quick-help-menu"
          aria-label="Ayuda rápida"
          className="fixed right-3 top-[calc(env(safe-area-inset-top)+4rem)] z-40 max-h-[70vh] w-[85vw] max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80"
        >
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Ayuda rápida</p>
          </div>
          <div className="max-h-[min(420px,calc(70vh-4rem))] overflow-y-auto p-3">
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/60 p-3 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm dark:border-sky-900/50 dark:bg-sky-950/40 dark:hover:border-sky-700"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900/60 dark:text-sky-300">
                    <NavIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-slate-300">
                      {HELP_DESCRIPTIONS[item.label] ?? "Accede a este módulo."}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.6 9a2.5 2.5 0 0 1 4.8.9c0 1.8-2.4 2.1-2.4 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r=".7" fill="currentColor" />
    </svg>
  );
}