"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  administrador: [
    { label: "Panel", href: "/dashboard/admin", icon: HomeIcon },
    { label: "Alumnos", href: "/dashboard/admin/alumnos", icon: StudentsIcon },
    { label: "Asistencia", href: "/dashboard/admin/asistencia", icon: AttendanceIcon },
    { label: "Categorías", href: "/dashboard/admin/categorias", icon: TagIcon },
    { label: "Reportes", href: "/dashboard/admin/reportes", icon: ChartIcon },
    { label: "Configuración", href: "/dashboard/admin/configuracion", icon: GearIcon },
  ],
  profesor: [
    { label: "Panel", href: "/dashboard/profesor", icon: HomeIcon },
    { label: "Registrar asistencia", href: "/dashboard/profesor/asistencia", icon: AttendanceIcon },
    { label: "Alumnos", href: "/dashboard/profesor/alumnos", icon: StudentsIcon },
  ],
  alumno: [
    { label: "Panel", href: "/dashboard/alumno", icon: HomeIcon },
    { label: "Mi historial", href: "/dashboard/alumno/historial", icon: HistoryIcon },
  ],
};

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { session } = useAuth();
  const pathname = usePathname();
  const items = session ? NAV_BY_ROLE[session.usuario.rol] ?? [] : [];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
          <Image
            src="/logo-el-golazo-club.jpg"
            alt="El Golazo Club"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
          />
          <div>
            <p className="text-sm font-bold tracking-wide text-[#0A1628]">
              EL GOLAZO CLUB
            </p>
            <p className="text-xs text-slate-500">
              {roleLabel(session?.usuario.rol)}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#edf8e8] text-[#16794C]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function roleLabel(rol?: Role) {
  switch (rol) {
    case "administrador":
      return "Panel del administrador";
    case "profesor":
      return "Panel del profesor";
    case "alumno":
      return "Panel del alumno";
    default:
      return "";
  }
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StudentsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AttendanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 3v3M17 3v3M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.5 15 2 2 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M11.5 3H5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .59 1.41l8.5 8.5a2 2 0 0 0 2.82 0l6.5-6.5a2 2 0 0 0 0-2.82l-8.5-8.5A2 2 0 0 0 11.5 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 3v5h5M3.05 13a9 9 0 1 0 2.13-7.14L3 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}