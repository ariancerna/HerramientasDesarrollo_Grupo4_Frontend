"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { NAV_ITEMS, NavIcon } from "@/constants/nav-items";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { session } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const items = session ? NAV_ITEMS[session.usuario.rol] : [];
  const hasMoreItems = items.length > 5;
  const visibleItems = hasMoreItems ? items.slice(0, 4) : items;
  const moreItems = hasMoreItems ? items.slice(4) : [];
  const isMoreActive = moreItems.some((item) => isCurrentRoute(pathname, item.href, item.href === items[0]?.href));

  if (visibleItems.length === 0) return null;

  return (
    <>
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 lg:hidden" onClick={() => setIsMoreOpen(false)}>
          <section id="mobile-more-options" role="dialog" aria-modal="true" aria-label="Más opciones de navegación" className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-3 shadow-2xl dark:bg-slate-900" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-ink dark:text-white">Más opciones</h2>
              <button type="button" onClick={() => setIsMoreOpen(false)} className="rounded-lg p-2 text-muted transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cerrar"><CloseIcon /></button>
            </div>
            <div className="grid gap-2">
              {moreItems.map((item) => {
                const isActive = isCurrentRoute(pathname, item.href, item.href === items[0]?.href);
                return <Link key={item.href} href={item.href} onClick={() => setIsMoreOpen(false)} aria-current={isActive ? "page" : undefined} className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${isActive ? "bg-primary-light text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400" : "text-ink hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}><NavIcon name={item.icon} className="h-5 w-5" />{item.label}</Link>;
              })}
            </div>
          </section>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900 lg:hidden" aria-label="Navegación móvil">
        {visibleItems.map((item) => {
          const isActive = isCurrentRoute(pathname, item.href, item.href === items[0]?.href);
          return <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined} className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition"><span className={`grid h-9 w-9 place-items-center rounded-full transition ${isActive ? "bg-primary-light text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400" : "text-muted dark:text-slate-500"}`}><NavIcon name={item.icon} className="h-5 w-5" /></span><span className={isActive ? "text-primary-dark dark:text-emerald-400" : "text-muted dark:text-slate-500"}>{item.shortLabel}</span></Link>;
        })}
        {hasMoreItems && (
          <button type="button" onClick={() => setIsMoreOpen(true)} aria-expanded={isMoreOpen} aria-controls="mobile-more-options" className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${isMoreActive ? "text-primary-dark dark:text-emerald-400" : "text-muted dark:text-slate-500"}`}>
            <span className={`grid h-9 w-9 place-items-center rounded-full transition ${isMoreActive ? "bg-primary-light text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-400" : "text-muted dark:text-slate-500"}`}><MoreIcon /></span>
            <span>Más</span>
          </button>
        )}
      </nav>
    </>
  );
}

function isCurrentRoute(pathname: string, href: string, isHome: boolean) {
  return pathname === href || (!isHome && pathname.startsWith(`${href}/`));
}

function MoreIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="19" cy="12" r="1.5" fill="currentColor" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
