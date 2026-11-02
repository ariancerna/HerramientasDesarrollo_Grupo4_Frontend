"use client";

import { RoleGuard } from "@/components/shared/role-guard";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <div className="min-h-screen min-h-dvh bg-bg-app dark:bg-bg-app-dark">
        <Sidebar />
        <div className="min-w-0 lg:pl-64">
          <Navbar />
          <main className="mx-auto min-w-0 max-w-[1440px] animate-fade-up px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </RoleGuard>
  );
}
