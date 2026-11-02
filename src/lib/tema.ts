import type { Tema } from "@/store/settings-store";

export const MEDIA_OSCURO = "(prefers-color-scheme: dark)";

/**
 * Script que corre antes del primer pintado para evitar el destello de tema
 * claro cuando el usuario eligió el oscuro.
 */
export function scriptTemaInicial(storageKey: string) {
  const temas: Tema[] = ["claro", "oscuro", "sistema"];
  return `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)})||"{}");var t=${JSON.stringify(temas)}.indexOf(s.tema)>=0?s.tema:"claro";var d=t==="oscuro"||(t==="sistema"&&window.matchMedia("${MEDIA_OSCURO}").matches);var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
}
