"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

type IconName = "home" | "students" | "attendance" | "tag" | "chart" | "settings";

const NAV_ITEMS: Record<Role, NavItem[]> = {
  administrador: [
    { label: "Inicio", href: "/dashboard/admin", icon: "home" },
    { label: "Alumnos", href: "/dashboard/admin/alumnos", icon: "students" },
    { label: "Asistencia", href: "/dashboard/admin/asistencia", icon: "attendance" },
    { label: "Categorías", href: "/dashboard/admin/categorias", icon: "tag" },
    { label: "Reportes", href: "/dashboard/admin/reportes", icon: "chart" },
    { label: "Configuración", href: "/dashboard/admin/configuracion", icon: "settings" },
  ],
  profesor: [
    { label: "Inicio", href: "/dashboard/profesor", icon: "home" },
    { label: "Registrar asistencia", href: "/dashboard/profesor/asistencia", icon: "attendance" },
    { label: "Alumnos", href: "/dashboard/profesor/alumnos", icon: "students" },
  ],
  alumno: [
    { label: "Inicio", href: "/dashboard/alumno", icon: "home" },
    { label: "Mi historial", href: "/dashboard/alumno/historial", icon: "attendance" },
  ],
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { session } = useAuth();
  const items = session ? NAV_ITEMS[session.usuario.rol] : [];

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0A1628] text-white shadow-xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <Image
            src="/logo-el-golazo-club.jpg"
            alt="El Golazo Club"
            width={48}
            height={48}
            priority
            className="h-12 w-12 shrink-0 rounded-full border-2 border-white/80 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold tracking-wide">EL GOLAZO</p>
            <p className="text-xs text-slate-400">Control de asistencia</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Navegación principal">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Menú
          </p>
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== items[0]?.href && pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#6FCF3A] text-[#0A1628]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
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

        <div className="border-t border-white/10 px-5 py-4">
          <p className="truncate text-sm font-semibold text-white">{session?.usuario.nombre}</p>
          <p className="mt-0.5 text-xs capitalize text-slate-400">{session?.usuario.rol}</p>
        </div>
      </aside>
    </>
  );
}

function NavIcon({ name }: { name: IconName }) {
  if (name === "home") {
    return <Icon><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" /></Icon>;
  }
  if (name === "students") {
    return <Icon><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" /></Icon>;
  }
  if (name === "attendance") {
    return <Icon><path d="M7 3v3M17 3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="3" /><path d="m8.5 15 2 2 4.5-5" /></Icon>;
  }
  if (name === "tag") {
    return <Icon><path d="M11.5 3H5a2 2 0 0 0-2 2v6.5l8.6 8.6a2 2 0 0 0 2.8 0l5.7-5.7a2 2 0 0 0 0-2.8Z" /><circle cx="8" cy="8" r="1.4" /></Icon>;
  }
  if (name === "chart") {
    return <Icon><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Icon>;
  }
  return <Icon><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></Icon>;
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}
