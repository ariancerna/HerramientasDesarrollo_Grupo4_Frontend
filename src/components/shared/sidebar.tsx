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
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-3 px-5">
        <Image
          src="/logo-el-golazo-club.jpg"
          alt="Escudo de El Golazo Club"
          width={40}
          height={40}
          priority
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/10"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[15px] font-bold tracking-tight text-white">El Golazo Club</p>
          <p className="truncate text-[11px] text-sidebar-muted">Gestión deportiva</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-sidebar-muted">
          Menú
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== items[0]?.href && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-white before:absolute before:-left-3 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-blue-400"
                      : "text-sidebar-text hover:bg-sidebar-accent/60 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-blue-300" : "text-sidebar-muted group-hover:text-white"}>
                    <NavIcon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
