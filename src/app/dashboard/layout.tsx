"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";
import { useSettings } from "@/hooks/use-settings";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();
  const dataTheme = settings.tema === "oscuro" ? "dark" : "light";

  return (
    <RoleGuard>
      <div data-theme={dataTheme} className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="min-w-0 lg:pl-72">
          <Navbar />
          <main className="mx-auto min-w-0 max-w-7xl px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </RoleGuard>
  );
}