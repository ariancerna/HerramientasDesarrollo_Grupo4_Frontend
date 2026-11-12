"use client";

import { Nfc } from "lucide-react";
import { NOMBRE_MARCA, numeroEnTarjeta, type MarcaTarjeta } from "@/lib/tarjeta";

export type BrilloTarjeta = "ninguno" | "procesando" | "aprobado" | "rechazado";

interface Tarjeta3DProps {
  digitos: string;
  marca: MarcaTarjeta;
  titular: string;
  vencimiento: string;
  cvc: string;
  /** Muestra el reverso (cuando se escribe el CVC). */
  volteada?: boolean;
  brillo?: BrilloTarjeta;
  className?: string;
}

const SOMBRA: Record<BrilloTarjeta, string> = {
  ninguno: "shadow-[0_24px_48px_-20px_rgb(30_58_138/0.45)]",
  procesando: "animate-brillo-tarjeta",
  aprobado: "shadow-[0_0_0_2px_rgb(74_222_128/0.9),0_0_48px_6px_rgb(34_197_94/0.45)]",
  rechazado: "animate-sacudir shadow-[0_0_0_2px_rgb(248_113_113/0.9),0_0_44px_6px_rgb(239_68_68/0.4)]",
};

// Fondo "vidrio" claro con un degradado azul hacia la esquina, como una tarjeta premium.
const FONDO =
  "bg-[linear-gradient(135deg,#ffffff_0%,#eef4ff_38%,#c9dcff_70%,#7ea6f5_100%)]";
// Líneas diagonales finas en la mitad derecha.
const LINEAS =
  "bg-[repeating-linear-gradient(115deg,transparent_0_9px,rgb(255_255_255/0.45)_9px_10px)] [mask-image:linear-gradient(90deg,transparent_45%,black_80%)]";

function Chip() {
  return (
    <svg viewBox="0 0 40 30" className="h-7 w-9" aria-hidden>
      <rect x="0.5" y="0.5" width="39" height="29" rx="5" fill="#d7dde8" stroke="#aab4c5" />
      <path d="M0 10h12M0 20h12M28 10h12M28 20h12M12 0v30M28 0v30M12 15h16" stroke="#9aa5b8" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function Marca({ marca, className = "" }: { marca: MarcaTarjeta; className?: string }) {
  if (marca === "mastercard") {
    return (
      <span className={`flex items-center ${className}`} aria-label="Mastercard">
        <span className="h-6 w-6 rounded-full bg-[#eb001b]/90" />
        <span className="-ml-2.5 h-6 w-6 rounded-full bg-[#f79e1b]/90 mix-blend-multiply" />
      </span>
    );
  }
  return (
    <span className={`text-base font-black italic tracking-tight text-[#1a3c8f] ${className}`}>
      {marca ? NOMBRE_MARCA[marca] : ""}
    </span>
  );
}

/** Tarjeta dibujada con giro 3D al reverso y brillo según el estado del pago. */
export function Tarjeta3D({ digitos, marca, titular, vencimiento, cvc, volteada, brillo = "ninguno", className = "" }: Tarjeta3DProps) {
  const cara = `absolute inset-0 overflow-hidden rounded-2xl border border-white/70 ${FONDO} [backface-visibility:hidden]`;

  return (
    <div className={`[perspective:1200px] ${className}`}>
      <div
        className={`relative aspect-[1.586] w-full rounded-2xl transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] ${SOMBRA[brillo]} ${
          volteada ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Frente */}
        <div className={cara}>
          <div className={`absolute inset-0 ${LINEAS}`} />
          <div className="relative flex h-full flex-col justify-between p-[7%] text-[#16244a]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Chip />
                <Nfc className="h-5 w-5 text-[#7b8aa6]" strokeWidth={1.6} aria-hidden />
              </div>
              <div className="text-right leading-none">
                <p className="text-[11px] font-extrabold tracking-[0.2em] text-[#1a3c8f]">EL GOLAZO</p>
                <p className="mt-1 text-[8px] font-semibold tracking-[0.35em] text-[#5b6f99]">CLUB</p>
              </div>
            </div>

            <p className="font-mono text-[clamp(15px,4.6vw,22px)] font-semibold tracking-[0.12em] tabular-nums [text-shadow:0_1px_0_rgb(255_255_255/0.7)]">
              {numeroEnTarjeta(digitos, marca)}
            </p>

            <div className="flex items-end justify-between gap-3">
              <div className="flex min-w-0 gap-5">
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold tracking-[0.18em] text-[#6b7a98]">TITULAR</p>
                  <p className="mt-0.5 truncate font-mono text-[12px] font-semibold uppercase tracking-wider">
                    {titular.trim() || "NOMBRE APELLIDO"}
                  </p>
                </div>
                <div className="shrink-0">
                  <p className="text-[8px] font-semibold tracking-[0.18em] text-[#6b7a98]">VENCE</p>
                  <p className="mt-0.5 font-mono text-[12px] font-semibold tracking-wider">{vencimiento || "MM/AA"}</p>
                </div>
              </div>
              <Marca marca={marca} />
            </div>
          </div>
        </div>

        {/* Reverso */}
        <div className={`${cara} [transform:rotateY(180deg)]`}>
          <div className="mt-[8%] h-[18%] w-full bg-[#111827]" />
          <div className="mx-[7%] mt-[7%] flex h-[17%] items-center gap-2">
            <div className="h-full flex-1 rounded-sm bg-[repeating-linear-gradient(135deg,#eef2f8_0_4px,#dfe5ef_4px_6px)]" />
            <div className="grid h-full w-[22%] place-items-center rounded-sm bg-white font-mono text-sm font-semibold tracking-[0.2em] text-[#16244a]">
              {cvc ? cvc : "•••"}
            </div>
          </div>
          <p className="mx-[7%] mt-[5%] text-[7px] leading-snug text-[#6b7a98]">
            Tarjeta de demostración del sistema de pagos de El Golazo Club. No es un medio de pago real.
          </p>
          <Marca marca={marca} className="absolute bottom-[8%] right-[7%]" />
        </div>
      </div>
    </div>
  );
}
