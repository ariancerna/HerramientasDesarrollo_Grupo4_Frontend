"use client";

import { useState, type FormEvent } from "react";
import { CreditCard, Loader2, Lock, X } from "lucide-react";
import { formatearMonto } from "@/store/pagos-store";
import type { TokenCulqi } from "@/lib/culqi";

/** Tarjeta de prueba que simula un rechazo del banco. */
export const TARJETA_DEMO_RECHAZADA = "4000020000000000";

interface CheckoutDemoProps {
  titulo: string;
  monto: number;
  onToken: (token: TokenCulqi) => Promise<void>;
  onCerrar: () => void;
}

type Marca = "Visa" | "Mastercard" | "American Express" | null;

function detectarMarca(numero: string): Marca {
  if (/^4/.test(numero)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(numero)) return "Mastercard";
  if (/^3[47]/.test(numero)) return "American Express";
  return null;
}

/** Algoritmo de Luhn: el mismo control que hacen las pasarelas reales. */
function numeroValido(numero: string) {
  if (!/^\d{13,19}$/.test(numero)) return false;
  let suma = 0;
  for (let i = 0; i < numero.length; i += 1) {
    let digito = Number(numero[numero.length - 1 - i]);
    if (i % 2 === 1) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }
  return suma % 10 === 0;
}

function vencimientoValido(valor: string) {
  const coincidencia = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(valor);
  if (!coincidencia) return false;
  const mes = Number(coincidencia[1]);
  const anio = 2000 + Number(coincidencia[2]);
  const hoy = new Date();
  return anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1);
}

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const claseInput =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

/**
 * Formulario de tarjeta para el modo demostración (sin llaves de Culqi).
 * Valida los datos como una pasarela real, pero no cobra nada: genera un
 * token "tkn_demo_..." que el backend acepta en modo demo.
 */
export function CheckoutDemo({ titulo, monto, onToken, onCerrar }: CheckoutDemoProps) {
  const [numero, setNumero] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const digitos = numero.replace(/\D/g, "");
  const marca = detectarMarca(digitos);

  function cambiarNumero(valor: string) {
    setError(null);
    const limpio = valor.replace(/\D/g, "").slice(0, 19);
    setNumero(limpio.replace(/(\d{4})(?=\d)/g, "$1 "));
  }

  function cambiarVencimiento(valor: string) {
    const limpio = valor.replace(/\D/g, "").slice(0, 4);
    setVencimiento(limpio.length > 2 ? `${limpio.slice(0, 2)}/${limpio.slice(2)}` : limpio);
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    if (!numeroValido(digitos)) return setError("El número de tarjeta no es válido.");
    if (!vencimientoValido(vencimiento)) return setError("La fecha de vencimiento no es válida o ya pasó.");
    const largoCvv = marca === "American Express" ? 4 : 3;
    if (!new RegExp(`^\\d{${largoCvv}}$`).test(cvv)) return setError(`El CVV debe tener ${largoCvv} dígitos.`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Ingresa un correo válido.");

    setProcesando(true);
    try {
      await esperar(1500); // Simula la tokenización en la pasarela.
      const id = digitos === TARJETA_DEMO_RECHAZADA ? "tkn_demo_rechazada" : `tkn_demo_${digitos.slice(-4)}${Date.now()}`;
      await onToken({ id, email: email.trim() });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo completar el pago.");
      setProcesando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="checkout-demo-titulo">
      <form onSubmit={enviar} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 bg-navy px-6 py-5 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Pago con tarjeta</p>
            <h2 id="checkout-demo-titulo" className="mt-1 text-lg font-bold first-letter:uppercase">{titulo}</h2>
            <p className="mt-1 text-2xl font-bold">{formatearMonto(monto)}</p>
          </div>
          <button type="button" onClick={onCerrar} disabled={procesando} aria-label="Cerrar" className="rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            Modo demostración: no se realiza ningún cobro real.
          </p>

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
              Número de tarjeta
              {marca && <span className="text-xs font-bold text-brand-green">{marca}</span>}
            </span>
            <div className="relative">
              <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input value={numero} onChange={(e) => cambiarNumero(e.target.value)} inputMode="numeric" autoComplete="cc-number" placeholder="4111 1111 1111 1111" className={`${claseInput} pl-9`} disabled={procesando} />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Vencimiento</span>
              <input value={vencimiento} onChange={(e) => cambiarVencimiento(e.target.value)} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" className={claseInput} disabled={procesando} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">CVV</span>
              <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" autoComplete="cc-csc" placeholder="123" type="password" className={claseInput} disabled={procesando} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Correo electrónico</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" className={claseInput} disabled={procesando} />
          </label>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={procesando} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-3 text-sm font-bold text-white hover:bg-brand-green-dark disabled:cursor-wait disabled:opacity-70">
            {procesando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
            {procesando ? "Procesando pago..." : `Pagar ${formatearMonto(monto)}`}
          </button>
          <p className="text-center text-xs text-slate-400">Tarjeta de prueba: 4111 1111 1111 1111 · cualquier fecha futura · CVV 123</p>
        </div>
      </form>
    </div>
  );
}
