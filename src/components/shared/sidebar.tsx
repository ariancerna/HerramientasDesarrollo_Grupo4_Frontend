"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { RoleAvatar } from "@/components/shared/navbar";
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

const ROLE_LABELS: Record<Role, string> = {
  administrador: "Administrador",
  profesor: "Profesor",
  alumno: "Alumno",
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
        className={`fixed inset-0 z-40 bg-contrast/45 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface shadow-xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <Image
            src="/logo-el-golazo-club.jpg"
            alt="El Golazo Club"
            width={40}
            height={40}
            priority
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold text-primary-dark">EL GOLAZO</p>
            <p className="truncate text-xs text-muted">Control de asistencia</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg text-body hover:bg-bg-subtle lg:hidden"
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-bg-subtle p-3">
            <RoleAvatar rol={session?.usuario.rol} nombre={session?.usuario.nombre} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{session?.usuario.nombre}</p>
              {session && (
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    session.usuario.rol === "administrador"
                      ? "bg-primary-light text-primary-dark"
                      : session.usuario.rol === "profesor"
                        ? "bg-info-light text-info"
                        : "bg-warning-light text-warning"
                  }`}
                >
                  {ROLE_LABELS[session.usuario.rol]}
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
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
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-primary text-contrast shadow-sm"
                        : "text-body hover:bg-bg-subtle hover:text-ink"
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

        <div className="border-t border-border px-4 py-4">
          <a
            href="https://wa.me/message/QOWSTIZGBL72H1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-primary-soft px-3 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-primary-light"
          >
            <HelpIcon />
            <span>¿Necesitas ayuda?</span>
          </a>
        </div>
      </aside>
    </>
  );
}

function NavIcon({ name }: { name: IconName }) {
  if (name === "home") return <Icon><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" /></Icon>;
  if (name === "students") return <Icon><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" /></Icon>;
  if (name === "attendance") return <Icon><path d="M7 3v3M17 3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="3" /><path d="m8.5 15 2 2 4.5-5" /></Icon>;
  if (name === "tag") return <Icon><path d="M11.5 3H5a2 2 0 0 0-2 2v6.5l8.6 8.6a2 2 0 0 0 2.8 0l5.7-5.7a2 2 0 0 0 0-2.8Z" /><circle cx="8" cy="8" r="1.4" /></Icon>;
  if (name === "chart") return <Icon><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Icon>;
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

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.5 9.2a2.5 2.5 0 1 1 3.9 2c-.9.6-1.4 1-1.4 2.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}