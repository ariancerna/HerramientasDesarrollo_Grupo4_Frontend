"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { NAV_ITEMS, NavIcon } from "@/constants/nav-items";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { session } = useAuth();
  const items = session ? NAV_ITEMS[session.usuario.rol] : [];

  if (items.length === 0) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900 lg:hidden"
      aria-label="Navegación móvil"
    >
      <div className="flex overflow-x-auto scrollbar-hide">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== items[0]?.href && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="flex min-w-[76px] flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition"
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full transition ${
                  isActive
                    ? "bg-primary-light text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "text-muted dark:text-slate-500"
                }`}
              >
                <NavIcon name={item.icon} className="h-5 w-5" />
              </span>
              <span
                className={`whitespace-nowrap ${
                  isActive
                    ? "text-primary-dark dark:text-emerald-400"
                    : "text-muted dark:text-slate-500"
                }`}
              >
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}