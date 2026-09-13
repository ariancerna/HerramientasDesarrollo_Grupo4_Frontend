"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { NAV_ITEMS, NavIcon } from "@/constants/nav-items";

export default function Sidebar() {
  const pathname = usePathname();
  const { session } = useAuth();
  const items = session ? NAV_ITEMS[session.usuario.rol] : [];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-600 dark:border-white/5 dark:bg-navy-shell dark:text-slate-300 lg:flex">
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <Image src="/logo-el-golazo-club.jpg" alt="El Golazo Club" width={60} height={60} priority className="h-15 w-15 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold tracking-wide text-slate-900 dark:text-white">EL GOLAZO</p>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">Control de asistencia</p>
        </div>
      </div>

      {/* Navegación - flex-1 para empujar el pie al fondo */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-4 py-2" aria-label="Navegación principal">
        <ul className="space-y-2.5">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== items[0]?.href && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition ${
                    isActive
                      ? "bg-brand-green font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* PIE: bloque de altura fija — texto arriba, pelota grande abajo, sin tocarse */}
      <div className="relative h-44 shrink-0">
        {/* Texto: arriba del todo del bloque, por encima de la pelota */}
        <div className="relative z-10 px-6 pt-2">
          <div className="h-0.5 w-8 rounded-full bg-amber-400" />
          <p className="mt-3 text-xs font-bold leading-5 text-brand-green dark:text-brand-lime-light">
            Disciplina hoy, grandes resultados mañana.
          </p>
        </div>

        {/* Marca de agua: pelota real, grande y notoria, empujada bien abajo */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-0 select-none opacity-[0.16] dark:opacity-[0.20]"
          aria-hidden="true"
        >
          <span style={{ fontSize: 210, lineHeight: 1 }}>🏐</span>
        </div>
      </div>
    </aside>
  );
}