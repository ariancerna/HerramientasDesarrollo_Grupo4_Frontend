"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2 } from "lucide-react";
import { abrirCheckoutCulqi, CULQI_PUBLIC_KEY } from "@/lib/culqi";
import { formatearMonto, formatearPeriodo, pagarMensualidadConCulqi } from "@/store/pagos-store";
import type { PagoMensualidad } from "@/types/pago";

interface PagarConTarjetaProps {
  mensualidad: PagoMensualidad;
  onPagado: (pago: PagoMensualidad) => void;
  onError: (mensaje: string) => void;
}

const claseBoton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-lime px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70";

/**
 * Botón de pago con tarjeta. Con NEXT_PUBLIC_CULQI_PUBLIC_KEY abre Culqi
 * Checkout; sin ella lleva a la página de pago simulado (/pago/mensualidad).
 */
export function PagarConTarjeta({ mensualidad, onPagado, onError }: PagarConTarjetaProps) {
  const [estado, setEstado] = useState<"inactivo" | "checkout" | "procesando">("inactivo");
  const texto = `Pagar ${formatearMonto(mensualidad.monto)} con tarjeta`;

  if (!CULQI_PUBLIC_KEY) {
    return (
      <Link href={`/pago/mensualidad?periodo=${mensualidad.periodo}`} className={claseBoton}>
        <CreditCard className="h-4 w-4" aria-hidden="true" />
        {texto}
      </Link>
    );
  }

  async function pagar() {
    setEstado("checkout");
    try {
      const token = await abrirCheckoutCulqi({ titulo: `Mensualidad ${formatearPeriodo(mensualidad.periodo)}`, monto: mensualidad.monto });
      if (!token) return; // El alumno cerró el checkout.
      setEstado("procesando");
      onPagado(await pagarMensualidadConCulqi(mensualidad.periodo, token.id, token.email));
    } catch (error) {
      onError(error instanceof Error ? error.message : "No se pudo completar el pago.");
    } finally {
      setEstado("inactivo");
    }
  }

  const ocupado = estado !== "inactivo";
  return (
    <button type="button" onClick={pagar} disabled={ocupado} className={claseBoton}>
      {ocupado ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CreditCard className="h-4 w-4" aria-hidden="true" />}
      {estado === "procesando" ? "Procesando pago..." : estado === "checkout" ? "Abriendo pasarela..." : texto}
    </button>
  );
}
