"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
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
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 pt-[env(safe-area-inset-top)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex h-16 min-w-0 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        {/* Buscador a la izquierda (como en la imagen profesional) */}
        <div className="flex flex-1 items-center">
          <GlobalSearch />
        </div>

        {/* Acciones a la derecha */}
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <QuickHelp />
          <NotificationBell />
          <ProfileMenu session={session} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}