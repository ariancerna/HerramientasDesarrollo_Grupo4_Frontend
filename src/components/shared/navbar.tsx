"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { ROLE_LABELS } from "@/constants/nav-items";
import { useAuth } from "@/hooks/use-auth";
import GlobalSearch from "./global-search";
import NotificationBell from "./notification-bell";
import ProfileMenu from "./profile-menu";

interface NavbarProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export default function Navbar({ isMenuOpen, onMenuToggle }: NavbarProps) {
  const { session, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex h-16 min-w-0 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#16794C]/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="dashboard-sidebar"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#0A1628] dark:text-white sm:text-base">
              Panel de {session ? ROLE_LABELS[session.usuario.rol].toLowerCase() : "usuario"}
            </p>
            <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
              El Golazo Club
            </p>
          </div>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <GlobalSearch />
          <NotificationBell />
          <ProfileMenu session={session} onLogout={handleLogout} />
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
