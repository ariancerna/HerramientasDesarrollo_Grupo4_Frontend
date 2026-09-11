"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { ROLE_LABELS } from "@/constants/nav-items";
import { useAuth } from "@/hooks/use-auth";
import GlobalSearch from "./global-search";
import NotificationBell from "./notification-bell";
import QuickHelp from "./quick-help";
import ProfileMenu from "./profile-menu";

export default function Navbar() {
  const { session, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex h-16 min-w-0 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink dark:text-white sm:text-base">
            Panel de {session ? ROLE_LABELS[session.usuario.rol].toLowerCase() : "usuario"}
          </p>
          <p className="hidden truncate text-xs text-body dark:text-slate-400 sm:block">
            El Golazo Club
          </p>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <GlobalSearch />
          <QuickHelp />
          <NotificationBell />
          <ProfileMenu session={session} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}