"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";

interface NavbarProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const ROLE_LABELS = {
  administrador: "Administrador",
  profesor: "Profesor",
  alumno: "Alumno",
} as const;

export default function Navbar({ isMenuOpen, onMenuToggle }: NavbarProps) {
  const { session, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 min-w-0 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#16794C]/40 lg:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="dashboard-sidebar"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#0A1628] sm:text-base">
              Panel de {session ? ROLE_LABELS[session.usuario.rol].toLowerCase() : "usuario"}
            </p>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              El Golazo Club
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden min-w-0 text-right md:block">
            <p className="max-w-56 truncate text-sm font-semibold text-slate-800">
              {session?.usuario.nombre}
            </p>
            <p className="text-xs text-slate-500">
              {session ? ROLE_LABELS[session.usuario.rol] : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#16794C]/40 sm:px-4"
          >
            <LogoutIcon />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M9 12h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
