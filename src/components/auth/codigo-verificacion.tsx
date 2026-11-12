"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

const LONGITUD = 6;

interface CodigoVerificacionProps {
  valor: string;
  onChange: (valor: string) => void;
  /** Se llama cuando se completan los 6 dígitos (al escribir o pegar). */
  onCompleto?: (valor: string) => void;
  error?: boolean;
  deshabilitado?: boolean;
}

/** Campo de código de 6 dígitos con una casilla por dígito; admite pegar el código completo. */
export function CodigoVerificacion({ valor, onChange, onCompleto, error, deshabilitado }: CodigoVerificacionProps) {
  const casillas = useRef<(HTMLInputElement | null)[]>([]);
  const digitos = Array.from({ length: LONGITUD }, (_, i) => valor[i] ?? "");

  function enfocar(indice: number) {
    const casilla = casillas.current[Math.max(0, Math.min(LONGITUD - 1, indice))];
    casilla?.focus();
    casilla?.select();
  }

  function actualizar(nuevo: string) {
    const limpio = nuevo.replace(/\D/g, "").slice(0, LONGITUD);
    onChange(limpio);
    if (limpio.length === LONGITUD) onCompleto?.(limpio);
  }

  function escribir(indice: number, texto: string) {
    let nuevos = texto.replace(/\D/g, "");
    if (!nuevos) return;
    // Casilla ya llena sin seleccionar: el navegador junta el dígito viejo y el nuevo.
    const anterior = digitos[indice];
    if (anterior && nuevos.length === 2) nuevos = nuevos.startsWith(anterior) ? nuevos.slice(1) : nuevos.slice(0, 1);
    // Si llegan varios dígitos (autocompletado del sistema), se reparten desde esta casilla.
    const base = digitos.slice(0, indice).join("");
    const resultado = (base + nuevos + digitos.slice(indice + nuevos.length).join("")).slice(0, LONGITUD);
    actualizar(resultado);
    enfocar(base.length + nuevos.length);
  }

  function teclear(indice: number, evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Backspace") {
      evento.preventDefault();
      if (digitos[indice]) {
        actualizar(digitos.slice(0, indice).join("") + digitos.slice(indice + 1).join(""));
      } else if (indice > 0) {
        actualizar(digitos.slice(0, indice - 1).join("") + digitos.slice(indice).join(""));
        enfocar(indice - 1);
      }
    } else if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      enfocar(indice - 1);
    } else if (evento.key === "ArrowRight") {
      evento.preventDefault();
      enfocar(indice + 1);
    }
  }

  function pegar(evento: ClipboardEvent<HTMLInputElement>) {
    evento.preventDefault();
    const pegado = evento.clipboardData.getData("text").replace(/\D/g, "").slice(0, LONGITUD);
    if (!pegado) return;
    actualizar(pegado);
    enfocar(pegado.length);
  }

  return (
    <div className="flex justify-between gap-2 sm:gap-3" role="group" aria-label="Código de verificación">
      {digitos.map((digito, i) => (
        <input
          key={i}
          ref={(el) => {
            casillas.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={LONGITUD}
          value={digito}
          disabled={deshabilitado}
          aria-label={`Dígito ${i + 1}`}
          aria-invalid={error}
          onChange={(e) => escribir(i, e.target.value)}
          onKeyDown={(e) => teclear(i, e)}
          onPaste={pegar}
          onFocus={(e) => e.target.select()}
          className={`h-14 w-full min-w-0 rounded-xl border bg-surface text-center text-2xl font-semibold tabular-nums text-ink outline-none transition focus:border-primary-light focus:ring-4 focus:ring-primary-light/15 disabled:opacity-60 ${
            error ? "border-danger" : digito ? "border-primary-light/60" : "border-line"
          }`}
        />
      ))}
    </div>
  );
}
