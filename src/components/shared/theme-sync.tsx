"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useSettings } from "@/hooks/use-settings";
import { MEDIA_OSCURO } from "@/lib/tema";

function suscribirSistema(onChange: () => void) {
  const media = window.matchMedia(MEDIA_OSCURO);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** Tema efectivo (claro u oscuro) resolviendo la opción "sistema". */
export function useTemaResuelto(): "claro" | "oscuro" {
  const { settings } = useSettings();
  const sistemaOscuro = useSyncExternalStore(
    suscribirSistema,
    () => window.matchMedia(MEDIA_OSCURO).matches,
    () => false,
  );
  if (settings.tema === "sistema") return sistemaOscuro ? "oscuro" : "claro";
  return settings.tema;
}

/** Aplica el tema elegido a <html> para toda la aplicación (incluido el login). */
export function ThemeSync() {
  const tema = useTemaResuelto();

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.theme = tema === "oscuro" ? "dark" : "light";
    raiz.style.colorScheme = tema === "oscuro" ? "dark" : "light";
  }, [tema]);

  return null;
}
