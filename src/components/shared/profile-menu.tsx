"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, KeyRound, LogOut, Settings, UserRound } from "lucide-react";
import UserAvatar from "@/components/shared/user-avatar";
import ProfileModal from "@/components/shared/profile-modal";
import { useDropdown } from "@/hooks/use-dropdown";
import type { Session } from "@/types";
import { NAV_ITEMS, ROLE_LABELS } from "@/constants/nav-items";
import { useAlumnos } from "@/store/alumnos-store";

interface ProfileMenuProps {
  session: Session | null;
  onLogout: () => void;
}

const claseItem =
  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted";

export default function ProfileMenu({ session, onLogout }: ProfileMenuProps) {
  const { ref, abierto, setAbierto, alternar } = useDropdown();
  const [verPerfil, setVerPerfil] = useState(false);
  const alumnos = useAlumnos();

  if (!session) return null;

  const { usuario } = session;
  const alumno = usuario.estudianteId ? alumnos.find((item) => item.id === usuario.estudianteId) : undefined;
  const rutaConfiguracion = NAV_ITEMS[usuario.rol].find((item) => item.icon === "settings")?.href;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={alternar}
        className={`flex min-w-0 items-center gap-2.5 rounded-lg p-1 pr-1.5 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/50 dark:hover:bg-slate-800 md:pr-2 ${
          abierto ? "bg-slate-100 dark:bg-slate-800" : ""
        }`}
        aria-label="Menú de perfil"
        aria-haspopup="menu"
        aria-expanded={abierto}
      >
        <UserAvatar
          nombre={usuario.nombre}
          fotoUrl={alumno?.fotoUrl ?? usuario.fotoUrl}
          className="h-9 w-9 bg-brand-green text-sm font-bold text-white"
        />
        <span className="hidden min-w-0 text-left leading-tight lg:block">
          <span className="block max-w-40 truncate text-[13px] font-semibold text-ink">{usuario.nombre}</span>
          <span className="block text-[11px] text-muted">{ROLE_LABELS[usuario.rol]}</span>
        </span>
        <ChevronDown className={`hidden h-3.5 w-3.5 text-muted transition-transform lg:block ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 animate-fade-up rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-12px_rgb(15_27_51/0.25)]"
        >
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <UserAvatar
              nombre={usuario.nombre}
              fotoUrl={alumno?.fotoUrl ?? usuario.fotoUrl}
              className="h-10 w-10 bg-brand-green text-sm font-bold text-white"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{usuario.nombre}</p>
              <p className="text-xs text-muted">{ROLE_LABELS[usuario.rol]}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-line" />

          <button
            type="button"
            role="menuitem"
            className={claseItem}
            onClick={() => {
              setAbierto(false);
              setVerPerfil(true);
            }}
          >
            <UserRound className="h-4 w-4 text-muted" /> Ver perfil
          </button>
          {rutaConfiguracion && (
            <>
              <Link role="menuitem" href={`${rutaConfiguracion}?tab=seguridad`} onClick={() => setAbierto(false)} className={claseItem}>
                <KeyRound className="h-4 w-4 text-muted" /> Cambiar contraseña
              </Link>
              <Link role="menuitem" href={rutaConfiguracion} onClick={() => setAbierto(false)} className={claseItem}>
                <Settings className="h-4 w-4 text-muted" /> Configuración
              </Link>
            </>
          )}

          <div className="my-1 h-px bg-line" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className={`${claseItem} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10`}
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      )}

      {verPerfil && <ProfileModal session={session} onClose={() => setVerPerfil(false)} />}
    </div>
  );
}
