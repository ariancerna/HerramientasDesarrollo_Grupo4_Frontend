"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { NAV_ITEMS, ROLE_LABELS, NavIcon } from "@/constants/nav-items";

export default function Sidebar() {
  const pathname = usePathname();
  const { session } = useAuth();
  const items = session ? NAV_ITEMS[session.usuario.rol] : [];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-slate-800 bg-[#0B132B] text-slate-300 lg:flex">
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-6 py-5">
        <Image src="/logo-el-golazo-club.jpg" alt="El Golazo Club" width={40} height={40} priority className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold tracking-wide text-white">EL GOLAZO</p>
          <p className="truncate text-xs text-slate-400">Control de asistencia</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Menú</p>
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== items[0]?.href && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-[#65D43B] font-bold text-slate-950" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"}`}>
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800/80 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-2.5">
          <SidebarAvatar nombre={session?.usuario.nombre} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{session?.usuario.nombre}</p>
            {session && <p className="truncate text-xs capitalize text-slate-400">{ROLE_LABELS[session.usuario.rol]}</p>}
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarAvatar({ nombre }: { nombre?: string }) {
  return <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-white">{nombre?.charAt(0).toUpperCase() ?? "?"}</span>;
}
