"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <RoleGuard>
      <div className="min-h-screen bg-bg">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="min-w-0 lg:pl-72">
          <Navbar
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen((current) => !current)}
          />
          <main className="mx-auto min-w-0 max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}