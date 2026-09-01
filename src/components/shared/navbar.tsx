"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { HeaderDropdown } from "@/components/shared/header-dropdown";

interface NavbarProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const ROLE_LABELS = {
  administrador: "Administrador",
  profesor: "Profesor",
  alumno: "Alumno",
} as const;

// TODO: reemplazar por datos reales cuando exista backend/notificaciones en vivo.
const NOTIFICATIONS = [
  { title: "Nueva asistencia registrada", description: "Se registró una asistencia hace unos minutos.", time: "Hoy" },
  { title: "Recordatorio", description: "Revisa las categorías pendientes de configurar.", time: "Ayer" },
];

const HELP_ITEMS = [
  { title: "¿Cómo registro una asistencia?", description: "Ve a Registrar asistencia y escanea o ingresa el DNI." },
  { title: "¿Cómo busco un alumno?", description: "Usa el buscador de arriba o entra al módulo Alumnos." },
  { title: "Contactar soporte", description: "Escríbenos por WhatsApp al 994 796 381.", onClick: () => window.open("https://wa.me/message/QOWSTIZGBL72H1", "_blank") },
];

export default function Navbar({ isMenuOpen, onMenuToggle }: NavbarProps) {
  const { session, logout } = useAuth();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<"notifications" | "help" | null>(null);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  const toggleMenu = (menu: "notifications" | "help") => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const topButtonClass =
    "relative rounded-xl p-2 text-body transition hover:-translate-y-0.5 hover:bg-bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-95";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex h-16 min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuToggle}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-body transition hover:bg-bg-subtle focus:outline-none focus:ring-2 focus:ring-primary/40 lg:hidden"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="dashboard-sidebar"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Buscador */}
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <div className="flex items-center gap-2 rounded-full bg-bg-subtle px-4 py-2.5 text-body transition focus-within:ring-4 focus-within:ring-primary/15">
            <SearchIcon className="h-[18px] w-[18px] shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar módulos, alumnos, asistencias..."
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
            {search.trim() && (
              <button type="button" onClick={() => setSearch("")} className="shrink-0 text-muted hover:text-ink">
                <CloseIcon />
              </button>
            )}
          </div>

          {search.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-popover">
              <div className="border-b border-border bg-bg-subtle px-4 py-3 text-xs font-bold text-body">
                Resultados para &ldquo;{search}&rdquo;
              </div>
              <p className="p-4 text-sm text-body">
                La búsqueda en vivo llegará cuando conectemos los datos reales (Sprint 2).
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("notifications")}
              className={topButtonClass}
              aria-label="Notificaciones"
              aria-expanded={openMenu === "notifications"}
            >
              <BellIcon />
              {NOTIFICATIONS.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-surface">
                  {NOTIFICATIONS.length}
                </span>
              )}
            </button>
            {openMenu === "notifications" && (
              <HeaderDropdown
                title="Notificaciones"
                icon={<BellIcon />}
                items={NOTIFICATIONS}
                emptyText="No tienes notificaciones nuevas."
                onClose={() => setOpenMenu(null)}
              />
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("help")}
              className={topButtonClass}
              aria-label="Ayuda rápida"
              aria-expanded={openMenu === "help"}
            >
              <HelpIcon />
            </button>
            {openMenu === "help" && (
              <HeaderDropdown
                title="Ayuda rápida"
                icon={<HelpIcon />}
                items={HELP_ITEMS}
                emptyText="No hay ayuda disponible."
                onClose={() => setOpenMenu(null)}
              />
            )}
          </div>

          <div className="mx-1 hidden h-8 w-px bg-border sm:block" />

          <Link
            href="#"
            className="hidden min-w-0 items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-bg-subtle md:flex"
          >
            <RoleAvatar rol={session?.usuario.rol} nombre={session?.usuario.nombre} />
            <span className="min-w-0 text-left">
              <span className="block max-w-40 truncate text-sm font-semibold text-ink">
                {session?.usuario.nombre}
              </span>
              <span className="block text-xs text-muted">
                {session ? ROLE_LABELS[session.usuario.rol] : ""}
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-body transition hover:border-border-strong hover:bg-bg-subtle focus:outline-none focus:ring-2 focus:ring-primary/40 sm:px-4"
          >
            <LogoutIcon />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function RoleAvatar({ rol, nombre }: { rol?: "administrador" | "profesor" | "alumno"; nombre?: string }) {
  const inicial = nombre?.charAt(0).toUpperCase() ?? "?";
  const colorByRole = {
    administrador: "bg-primary text-contrast",
    profesor: "bg-info text-white",
    alumno: "bg-warning text-white",
  } as const;
  const colorClass = rol ? colorByRole[rol] : "bg-muted text-white";

  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${colorClass}`}>
      {inicial}
    </span>
  );
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function SearchIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-4 w-4"} aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}
function HelpIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M9.5 9.2a2.5 2.5 0 1 1 3.9 2c-.9.6-1.4 1-1.4 2.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="12" cy="17" r="0.9" fill="currentColor" /></svg>;
}
function LogoutIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M9 12h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}