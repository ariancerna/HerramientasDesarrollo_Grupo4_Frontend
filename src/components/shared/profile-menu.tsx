"use client";

import { useEffect, useRef, useState } from "react";
import type { Session } from "@/types";
import { ROLE_LABELS } from "@/constants/nav-items";

interface ProfileMenuProps {
  session: Session | null;
  onLogout: () => void;
}

export default function ProfileMenu({ session, onLogout }: ProfileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const inicial = session?.usuario.nombre.charAt(0).toUpperCase() ?? "?";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-w-0 items-center gap-2.5 rounded-lg p-1 pr-1.5 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#16794C]/40 dark:hover:bg-slate-800 sm:pr-2"
        aria-label="Menú de perfil"
        aria-expanded={isOpen}
      >
        <span className="hidden min-w-0 text-right md:block">
          <span className="block max-w-40 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {session?.usuario.nombre}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            {session ? ROLE_LABELS[session.usuario.rol] : ""}
          </span>
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#16794C] text-sm font-bold text-white">
          {inicial}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-700">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {session?.usuario.nombre}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {session ? ROLE_LABELS[session.usuario.rol] : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogoutIcon />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M9 12h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
