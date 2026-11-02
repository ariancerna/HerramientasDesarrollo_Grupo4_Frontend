"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDropdown } from "@/hooks/use-dropdown";
import { NAV_ITEMS, NavIcon } from "@/constants/nav-items";

/** Cuadrícula con los módulos del rol para saltar entre ellos rápidamente. */
export default function QuickAccess() {
  const { session } = useAuth();
  const { ref, abierto, setAbierto, alternar } = useDropdown();
  // El inicio ya está en el menú lateral; aquí solo los módulos de trabajo.
  const accesos = session ? NAV_ITEMS[session.usuario.rol].slice(1) : [];

  if (accesos.length === 0) return null;

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={alternar}
        title="Acceso rápido"
        aria-label="Acceso rápido"
        aria-expanded={abierto}
        className={`grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white ${
          abierto ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white" : ""
        }`}
      >
        <LayoutGrid className="h-[18px] w-[18px]" />
      </button>

      {abierto && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[340px] animate-fade-up rounded-xl border border-line bg-surface p-2 shadow-[0_16px_40px_-12px_rgb(15_27_51/0.25)]">
          <p className="eyebrow px-2 pb-2 pt-1">Acceso rápido</p>
          <div className="grid grid-cols-2 gap-1">
            {accesos.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className="group flex flex-col items-start gap-2 rounded-lg p-3 transition-colors hover:bg-surface-muted"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-green-soft text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-white dark:text-brand-lime-light">
                  <NavIcon name={item.icon} />
                </span>
                <span className="text-[13px] font-semibold text-ink">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
