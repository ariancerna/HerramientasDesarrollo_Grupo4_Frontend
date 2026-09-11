"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { NAV_ITEMS, NavIcon } from "@/constants/nav-items";
import { useAuth } from "@/hooks/use-auth";

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
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#16794C]/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
          className="fixed inset-x-4 top-16 z-40 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72"
        >
          <div className="px-2 py-2.5">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Ayuda rápida</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Elige el módulo que necesitas consultar.</p>
          </div>
          <ul className="border-t border-slate-100 pt-1 dark:border-slate-700">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <NavIcon name={item.icon} className="h-4 w-4 text-[#16794C] dark:text-emerald-400" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
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
