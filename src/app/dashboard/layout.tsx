"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import Navbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <RoleGuard>
      <div className="min-h-screen bg-[#f5f7f6]">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="min-w-0 lg:pl-64">
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
