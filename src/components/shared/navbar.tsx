"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import GlobalSearch from "./global-search";
import InstallAppButton from "./install-app-button";
import NotificationBell from "./notification-bell";
import QuickAccess from "./quick-access";
import QuickHelp from "./quick-help";
import ProfileMenu from "./profile-menu";
import { ThemeMenu } from "./theme-menu";

export default function Navbar() {
  const { session, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="flex h-16 min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Image
          src="/logo-el-golazo-club.jpg"
          alt="El Golazo Club"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover lg:hidden"
        />

        <div className="flex min-w-0 flex-1 items-center">
          <GlobalSearch />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <InstallAppButton />
          <QuickAccess />
          <ThemeMenu />
          <QuickHelp />
          <NotificationBell />
          <div className="mx-1.5 hidden h-6 w-px bg-line md:block" />
          <ProfileMenu session={session} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
