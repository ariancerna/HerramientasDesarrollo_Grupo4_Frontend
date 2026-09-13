"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { NAV_ITEMS, NavIcon, type NavItem } from "@/constants/nav-items";

export default function GlobalSearch() {
  const { session } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const items = useMemo(
    () => (session ? NAV_ITEMS[session.usuario.rol] : []),
    [session],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return items.filter((item) => item.label.toLowerCase().includes(term));
  }, [items, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const goTo = (href: string) => {
    router.push(href);
    setQuery("");
    setIsOpen(false);
    setIsMobileOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (results[0]) goTo(results[0].href);
  };

  if (items.length === 0) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsMobileOpen((current) => !current)}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
        aria-label="Buscar en el panel"
        aria-expanded={isMobileOpen}
      >
        <SearchIcon />
      </button>

      <form onSubmit={handleSubmit} className="hidden sm:block">
        <label className="relative block">
          <span className="sr-only">Buscar en el panel</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            type="search"
            placeholder="Buscar en el panel..."
            className="h-10 w-36 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800 md:w-52 lg:w-72"
          />
        </label>
      </form>

      {isOpen && query.trim() && (
        <div className="absolute right-0 top-full z-40 mt-2 hidden w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:block">
          <SearchResultsList results={results} onSelect={goTo} />
        </div>
      )}

      {isMobileOpen && (
        <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4rem)] z-40 border-b border-slate-200 bg-white p-3 shadow-md dark:border-slate-700 dark:bg-slate-900 sm:hidden">
          <form onSubmit={handleSubmit} className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Buscar en el panel..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </form>
          {query.trim() && (
            <div className="mt-2">
              <SearchResultsList results={results} onSelect={goTo} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultsList({
  results,
  onSelect,
}: {
  results: NavItem[];
  onSelect: (href: string) => void;
}) {
  if (results.length === 0) {
    return <p className="px-3 py-4 text-center text-sm text-slate-400 dark:text-slate-500">Sin resultados</p>;
  }

  return (
    <ul className="space-y-0.5">
      {results.map((item) => (
        <li key={item.href}>
          <button
            type="button"
            onClick={() => onSelect(item.href)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <NavIcon name={item.icon} className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-5 w-5"} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
