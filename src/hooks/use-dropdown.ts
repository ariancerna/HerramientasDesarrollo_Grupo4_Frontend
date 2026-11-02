import { useEffect, useRef, useState } from "react";

/** Estado de un menú desplegable que se cierra al hacer clic fuera o con Escape. */
export function useDropdown<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    function alHacerClic(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setAbierto(false);
    }
    function alPresionarTecla(event: KeyboardEvent) {
      if (event.key === "Escape") setAbierto(false);
    }

    document.addEventListener("mousedown", alHacerClic);
    document.addEventListener("keydown", alPresionarTecla);
    return () => {
      document.removeEventListener("mousedown", alHacerClic);
      document.removeEventListener("keydown", alPresionarTecla);
    };
  }, [abierto]);

  return { ref, abierto, setAbierto, alternar: () => setAbierto((actual) => !actual) };
}
