"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useDropdown } from "@/hooks/use-dropdown";
import { useSettings } from "@/hooks/use-settings";
import { useTemaResuelto } from "@/components/shared/theme-sync";
import type { Tema } from "@/store/settings-store";

const TEMAS: { valor: Tema; etiqueta: string; Icono: typeof Sun }[] = [
  { valor: "claro", etiqueta: "Claro", Icono: Sun },
  { valor: "oscuro", etiqueta: "Oscuro", Icono: Moon },
  { valor: "sistema", etiqueta: "Sistema", Icono: Monitor },
];

interface ThemeMenuProps {
  /** Estilo del botón: "toolbar" en la barra superior, "outline" sobre el login. */
  variante?: "toolbar" | "outline";
}

/** Selector de apariencia (claro, oscuro o según el sistema operativo). */
export function ThemeMenu({ variante = "toolbar" }: ThemeMenuProps) {
  const { settings, setTema } = useSettings();
  const resuelto = useTemaResuelto();
  const { ref, abierto, setAbierto, alternar } = useDropdown();
  const IconoActual = resuelto === "oscuro" ? Moon : Sun;

  const claseBoton =
    variante === "toolbar"
      ? "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      : "border border-line bg-surface text-body shadow-sm hover:text-ink";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={alternar}
        title="Apariencia"
        aria-label="Cambiar apariencia"
        aria-haspopup="menu"
        aria-expanded={abierto}
        className={`grid h-9 w-9 place-items-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/50 ${claseBoton} ${abierto ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white" : ""}`}
      >
        <IconoActual className="h-[18px] w-[18px]" />
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 animate-fade-up rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-12px_rgb(15_27_51/0.25)]"
        >
          <p className="eyebrow px-2.5 pb-1.5 pt-1">Apariencia</p>
          {TEMAS.map(({ valor, etiqueta, Icono }) => (
            <button
              key={valor}
              type="button"
              role="menuitemradio"
              aria-checked={settings.tema === valor}
              onClick={() => {
                setTema(valor);
                setAbierto(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-surface-muted ${
                settings.tema === valor ? "text-brand-green dark:text-brand-lime-light" : "text-ink"
              }`}
            >
              <Icono className="h-4 w-4" />
              <span className="flex-1 text-left">{etiqueta}</span>
              {settings.tema === valor && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
