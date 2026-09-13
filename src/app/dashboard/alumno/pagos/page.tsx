"use client";

import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import {
  formatearMonto,
  formatearPeriodo,
  obtenerPagosPorEstudiante,
} from "@/store/pagos-store";
import type { EstadoPago, PagoMensualidad } from "@/types/pago";

const ESTADO_CONFIG: Record<
  EstadoPago,
  { etiqueta: string; clase: string; detalle: string }
> = {
  pagado: {
    etiqueta: "Pagado",
    clase:
      "bg-brand-green-soft text-brand-green ring-brand-green/20 dark:bg-brand-green/15 dark:text-brand-lime-light dark:ring-brand-green/20",
    detalle: "Tu mensualidad se encuentra al día.",
  },
  pendiente: {
    etiqueta: "Pendiente",
    clase:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20",
    detalle: "Realiza el pago antes de la fecha de vencimiento.",
  },
  vencido: {
    etiqueta: "Vencido",
    clase:
      "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/20",
    detalle: "Comunícate con administración para regularizar tu mensualidad.",
  },
};

export default function PagosAlumnoPage() {
  const { session } = useAuth();
  const estudianteId = session?.usuario.estudianteId;
  const pagos = estudianteId ? obtenerPagosPorEstudiante(estudianteId) : [];
  const mensualidad = pagos[0];
  const pagosRealizados = pagos.filter((pago) => pago.estado === "pagado");

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <header className="mb-6">
          {/* ❌ Eliminado: <p>MI ESPACIO</p> */}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Mis pagos
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Consulta el estado de tu mensualidad y el historial de pagos.
          </p>
        </header>

        {!estudianteId ? (
          <MensajeVacio texto="No se pudo identificar al alumno asociado a esta sesión." />
        ) : !mensualidad ? (
          <MensajeVacio texto="Todavía no hay mensualidades registradas para este alumno." />
        ) : (
          <>
            {/* 🎨 CAMBIO: bg-[#0A1628] → bg-navy */}
            <section className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-sm sm:p-8">
              {/* 🎨 CAMBIO: bg-[#6FCF3A]/15 → bg-brand-lime/15 */}
              <div
                className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-20 rounded-full bg-brand-lime/15"
                aria-hidden="true"
              />
              <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-slate-300">Mensualidad actual</p>
                    <EstadoBadge estado={mensualidad.estado} />
                  </div>
                  <h2 className="mt-3 text-2xl font-bold first-letter:uppercase sm:text-3xl">
                    {formatearPeriodo(mensualidad.periodo)}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                    {ESTADO_CONFIG[mensualidad.estado].detalle}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 rounded-xl border border-white/15 bg-white/5 px-5 py-4">
                  <div>
                    <p className="text-xs text-slate-400">Importe</p>
                    <p className="mt-1 text-xl font-bold">{formatearMonto(mensualidad.monto)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Vencimiento</p>
                    <p className="mt-1 text-base font-bold">{formatearFecha(mensualidad.vencimiento)}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-3">
              <ResumenPago etiqueta="Pagos registrados" valor={String(pagos.length)} />
              <ResumenPago etiqueta="Pagos realizados" valor={String(pagosRealizados.length)} />
              <ResumenPago
                etiqueta="Total abonado"
                valor={formatearMonto(
                  pagosRealizados.reduce((total, pago) => total + pago.monto, 0),
                )}
              />
            </section>

            <section className="mt-8">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Historial de mensualidades
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Detalle de tus últimos movimientos registrados.
                </p>
              </div>
              <TablaPagos pagos={pagos} />
            </section>
          </>
        )}
      </div>
    </RoleGuard>
  );
}

function EstadoBadge({ estado }: { estado: EstadoPago }) {
  const config = ESTADO_CONFIG[estado];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${config.clase}`}>
      {config.etiqueta}
    </span>
  );
}

function ResumenPago({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{etiqueta}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{valor}</p>
    </div>
  );
}

function TablaPagos({ pagos }: { pagos: PagoMensualidad[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full min-w-[760px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            {['Periodo', 'Concepto', 'Importe', 'Vencimiento', 'Fecha de pago', 'Estado'].map((titulo) => (
              <th key={titulo} className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                {titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {pagos.map((pago) => (
            <tr key={pago.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 first-letter:uppercase dark:text-white">
                {formatearPeriodo(pago.periodo)}
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{pago.concepto}</td>
              <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-white">
                {formatearMonto(pago.monto)}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                {formatearFecha(pago.vencimiento)}
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                {pago.fechaPago ? (
                  <div>
                    <p className="whitespace-nowrap">{formatearFecha(pago.fechaPago)}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {pago.metodoPago} · {pago.codigoOperacion}
                    </p>
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-5 py-4"><EstadoBadge estado={pago.estado} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MensajeVacio({ texto }: { texto: string }) {
  return (
    <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
      {texto}
    </div>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fecha}T12:00:00`));
}