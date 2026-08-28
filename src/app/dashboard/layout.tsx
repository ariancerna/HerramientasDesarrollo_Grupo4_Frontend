"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RoleGuard>
      <div className="flex min-h-screen bg-[#f5f7f6]">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex flex-1 flex-col">
          <Navbar onMenuClick={() => setMobileOpen(true)} />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}