"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { Role } from "@/types";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { session, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const nombre = session?.usuario.nombre ?? "Usuario";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </button>

      <div className="relative max-w-md flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Buscar..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#6FCF3A] focus:outline-none focus:ring-2 focus:ring-[#6FCF3A]/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Notificaciones"
        >
          <BellIcon />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#e6543b]" />
        </button>

        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0A1628] text-sm font-bold text-white">
            {inicial}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">{nombre}</p>
            <p className="text-xs capitalize text-slate-500">
              {roleLabel(session?.usuario.rol)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

function roleLabel(rol?: Role) {
  switch (rol) {
    case "administrador":
      return "Administrador";
    case "profesor":
      return "Profesor";
    case "alumno":
      return "Alumno";
    default:
      return "";
  }
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}