"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleCheck, CircleX, CreditCard, Loader2, Lock, Mail, UserRound } from "lucide-react";

import { Tarjeta3D, type BrilloTarjeta } from "@/components/pagos/tarjeta-3d";
import { ThemeMenu } from "@/components/shared/theme-menu";
import { useAuth } from "@/hooks/use-auth";
import { useDatosRemotos } from "@/lib/remote-collection";
import {
  TARJETAS_PRUEBA,
  NOMBRE_MARCA,
  agruparNumero,
  detectarMarca,
  formatearVencimiento,
  largoCvc,
  largoMaximo,
  numeroValido,
  soloDigitos,
  vencimientoValido,
} from "@/lib/tarjeta";
import { formatearMonto, formatearPeriodo, obtenerPagosPorEstudiante, pagarMensualidadConCulqi, pagosCargados } from "@/store/pagos-store";
import type { PagoMensualidad } from "@/types/pago";

const RUTA_MIS_PAGOS = "/dashboard/alumno/pagos";
const DURACION_MINIMA_AUTORIZACION = 2400;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fase = "formulario" | "procesando" | "aprobado" | "rechazado";
type Campo = "titular" | "numero" | "vencimiento" | "cvc" | "correo";

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function formatearFecha(iso: string) {
  if (!iso) return "";
  const fecha = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(fecha.getTime())) return "";
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(fecha);
}

const claseEtiqueta = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted";
const claseInput =
  "h-12 w-full rounded-xl border bg-surface pl-11 pr-4 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary-light focus:ring-4 focus:ring-primary-light/15";

/** Checkout simulado de la mensualidad del alumno (modo demostración, sin cobro real). */
export function CheckoutMensualidad({ periodo }: { periodo?: string }) {
  useDatosRemotos();
  const { session } = useAuth();
  const estudianteId = session?.usuario.estudianteId;
  const pagos = estudianteId ? obtenerPagosPorEstudiante(estudianteId) : [];
  const mensualidad = periodo ? pagos.find((p) => p.periodo === periodo) : pagos.find((p) => p.estado !== "pagado");

  const [fase, setFase] = useState<Fase>("formulario");
  const [titular, setTitular] = useState(() => (session?.usuario.nombre ?? "").toUpperCase());
  const [digitos, setDigitos] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvc, setCvc] = useState("");
  const [correo, setCorreo] = useState("");
  const [cvcActivo, setCvcActivo] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [resultado, setResultado] = useState<{ pago?: PagoMensualidad; mensaje?: string; monto: number }>({ monto: 0 });

  const marca = detectarMarca(digitos);
  const ultimos4 = digitos.slice(-4);
  const etiquetaTarjeta = `${marca ? NOMBRE_MARCA[marca] : "Tarjeta"} •••• ${ultimos4}`;

  function limpiarError(campo: Campo) {
    setErrores((e) => (e[campo] ? { ...e, [campo]: undefined } : e));
  }

  function validar() {
    const nuevos: Partial<Record<Campo, string>> = {};
    if (titular.trim().length < 3) nuevos.titular = "Escribe el nombre como aparece en la tarjeta.";
    if (!numeroValido(digitos)) nuevos.numero = "El número de tarjeta no es válido.";
    if (!vencimientoValido(vencimiento)) nuevos.vencimiento = "Fecha inválida o vencida.";
    if (cvc.length !== largoCvc(marca)) nuevos.cvc = `Debe tener ${largoCvc(marca)} dígitos.`;
    if (!CORREO_VALIDO.test(correo.trim())) nuevos.correo = "Ingresa un correo válido.";
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function pagar(evento: FormEvent) {
    evento.preventDefault();
    if (!mensualidad || !validar()) return;

    const monto = mensualidad.monto;
    setResultado({ monto });
    setFase("procesando");
    // Token de demostración: el backend en modo demo lo acepta sin contactar a ningún banco.
    const token = digitos === TARJETAS_PRUEBA.rechazada ? "tkn_demo_rechazada" : `tkn_demo_${ultimos4}${Date.now()}`;
    const [pago] = await Promise.allSettled([
      pagarMensualidadConCulqi(mensualidad.periodo, token, correo.trim().toLowerCase()),
      esperar(DURACION_MINIMA_AUTORIZACION),
    ]);
    if (pago.status === "fulfilled") {
      setResultado({ monto, pago: pago.value });
      setFase("aprobado");
    } else {
      const mensaje = pago.reason instanceof Error ? pago.reason.message : "El banco rechazó el pago.";
      setResultado({ monto, mensaje });
      setFase("rechazado");
    }
  }

  function reintentar() {
    setCvc("");
    setFase("formulario");
  }

  const brillo: BrilloTarjeta = fase === "formulario" ? "ninguno" : fase;

  return (
    <main className="min-h-screen min-h-dvh bg-bg-auth px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1040px]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href={RUTA_MIS_PAGOS} className="inline-flex items-center gap-1.5 text-sm font-medium text-body transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Volver a mis pagos
          </Link>
          <ThemeMenu variante="outline" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgb(15_27_51/0.45)] dark:shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)]">
          <Encabezado completado={fase === "aprobado"} />

          {!pagosCargados() ? (
            <EstadoSimple>
              <Loader2 className="h-6 w-6 animate-spin text-primary-light" />
              <p className="text-sm text-body">Cargando tu mensualidad…</p>
            </EstadoSimple>
          ) : !mensualidad || (mensualidad.estado === "pagado" && fase === "formulario") ? (
            <EstadoSimple>
              <CircleCheck className="h-10 w-10 text-success" strokeWidth={1.6} />
              <p className="text-lg font-semibold text-ink">{mensualidad ? "Esta mensualidad ya está pagada" : "No tienes mensualidades pendientes"}</p>
              <Link href={RUTA_MIS_PAGOS} className="mt-2 text-sm font-semibold text-primary-light hover:underline dark:text-blue-300">
                Ir a mis pagos
              </Link>
            </EstadoSimple>
          ) : fase === "formulario" ? (
            <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
              {/* Vista previa y resumen */}
              <section className="flex flex-col gap-6 bg-[linear-gradient(160deg,#eef3fb_0%,#e2eaf7_100%)] p-6 sm:p-8 dark:bg-[linear-gradient(160deg,#0e1a33_0%,#0a1428_100%)]">
                <Tarjeta3D
                  digitos={digitos}
                  marca={marca}
                  titular={titular}
                  vencimiento={vencimiento}
                  cvc={cvc}
                  volteada={cvcActivo}
                  className="mx-auto w-full max-w-[360px] md:mt-6"
                />
                <Resumen mensualidad={mensualidad} />
              </section>

              {/* Formulario */}
              <form onSubmit={pagar} noValidate className="p-6 sm:p-8">
                <h1 className="text-2xl font-bold tracking-tight text-ink">Datos de pago</h1>
                <p className="mt-1 text-sm text-body">Ingresa tu tarjeta para completar el pago.</p>

                <div className="mt-6 space-y-4">
                  <CampoTexto etiqueta="Titular de la tarjeta" error={errores.titular} icono={<UserRound />}>
                    <input
                      value={titular}
                      onChange={(e) => {
                        setTitular(e.target.value.toUpperCase().slice(0, 26));
                        limpiarError("titular");
                      }}
                      autoComplete="cc-name"
                      placeholder="NOMBRE APELLIDO"
                      aria-label="Titular de la tarjeta"
                      className={`${claseInput} uppercase ${errores.titular ? "border-danger" : "border-line"}`}
                    />
                  </CampoTexto>

                  <CampoTexto
                    etiqueta="Número de tarjeta"
                    error={errores.numero}
                    icono={<CreditCard />}
                    extra={marca && <span className="text-xs font-black italic text-[#1a3c8f] dark:text-blue-300">{NOMBRE_MARCA[marca]}</span>}
                  >
                    <input
                      value={agruparNumero(digitos, marca)}
                      onChange={(e) => {
                        const nuevos = soloDigitos(e.target.value);
                        setDigitos(nuevos.slice(0, largoMaximo(detectarMarca(nuevos))));
                        limpiarError("numero");
                      }}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="0000 0000 0000 0000"
                      aria-label="Número de tarjeta"
                      className={`${claseInput} pr-[4.5rem] font-mono tracking-wide ${errores.numero ? "border-danger" : "border-line"}`}
                    />
                  </CampoTexto>

                  <div className="grid grid-cols-2 gap-4">
                    <CampoTexto etiqueta="Vencimiento" error={errores.vencimiento} icono={<CalendarDays />}>
                      <input
                        value={vencimiento}
                        onChange={(e) => {
                          setVencimiento(formatearVencimiento(e.target.value));
                          limpiarError("vencimiento");
                        }}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        aria-label="Vencimiento"
                        className={`${claseInput} font-mono ${errores.vencimiento ? "border-danger" : "border-line"}`}
                      />
                    </CampoTexto>
                    <CampoTexto
                      etiqueta={
                        <>
                          CVC <span className="font-normal normal-case tracking-normal">· reverso</span>
                        </>
                      }
                      error={errores.cvc}
                      icono={<Lock />}
                    >
                      <input
                        value={cvc}
                        onChange={(e) => {
                          setCvc(soloDigitos(e.target.value).slice(0, largoCvc(marca)));
                          limpiarError("cvc");
                        }}
                        onFocus={() => setCvcActivo(true)}
                        onBlur={() => setCvcActivo(false)}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="•••"
                        aria-label="CVC"
                        className={`${claseInput} font-mono tracking-[0.3em] ${errores.cvc ? "border-danger" : "border-line"}`}
                      />
                    </CampoTexto>
                  </div>

                  <CampoTexto etiqueta="Correo para el comprobante" error={errores.correo} icono={<Mail />}>
                    <input
                      value={correo}
                      onChange={(e) => {
                        setCorreo(e.target.value);
                        limpiarError("correo");
                      }}
                      type="email"
                      autoComplete="email"
                      placeholder="tucorreo@ejemplo.com"
                      aria-label="Correo para el comprobante"
                      className={`${claseInput} ${errores.correo ? "border-danger" : "border-line"}`}
                    />
                  </CampoTexto>
                </div>

                <button
                  type="submit"
                  className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#2563eb,#1e40af)] text-base font-semibold text-white shadow-[0_14px_28px_-14px_rgb(37_99_235/0.9)] transition hover:brightness-110"
                >
                  <Lock className="h-4 w-4" /> Pagar {formatearMonto(mensualidad.monto)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="mt-3 text-center text-xs text-muted">Modo demostración: no se realiza ningún cobro real.</p>
              </form>
            </div>
          ) : (
            <Autorizacion
              fase={fase}
              brillo={brillo}
              tarjeta={{ digitos, marca, titular, vencimiento, cvc }}
              etiquetaTarjeta={etiquetaTarjeta}
              resultado={resultado}
              onReintentar={reintentar}
            />
          )}
        </div>

        {fase === "formulario" && mensualidad && mensualidad.estado !== "pagado" && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            <span>Tarjetas de prueba:</span>
            <BotonPrueba onClick={() => setDigitos(TARJETAS_PRUEBA.aprobada)}>4242 4242 4242 4242 · aprobada</BotonPrueba>
            <BotonPrueba onClick={() => setDigitos(TARJETAS_PRUEBA.rechazada)}>4000 0200 0000 0000 · rechazada</BotonPrueba>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------------------------------------------------------------- */

const PASOS = ["Mensualidad", "Resumen", "Pago"];

function Encabezado({ completado }: { completado: boolean }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Image src="/logo-el-golazo-club.jpg" alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        <p className="text-sm font-bold tracking-[0.12em] text-ink">
          EL GOLAZO <span className="font-medium tracking-[0.12em] text-muted">· PAGO SEGURO</span>
        </p>
      </div>
      <ol className="flex items-center gap-2 text-xs font-medium sm:gap-3">
        {PASOS.map((paso, i) => {
          const hecho = i < 2 || completado;
          const actual = i === 2 && !completado;
          return (
            <li key={paso} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && <span className="h-px w-4 bg-line sm:w-6" aria-hidden />}
              <span className={`flex items-center gap-1.5 ${actual ? "text-ink" : "text-body"}`}>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                    hecho ? "bg-success text-white" : "bg-primary-light text-white"
                  }`}
                >
                  {hecho ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className={i < 2 ? "hidden sm:inline" : ""}>{paso}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </header>
  );
}

function Resumen({ mensualidad }: { mensualidad: PagoMensualidad }) {
  const vence = formatearFecha(mensualidad.vencimiento);
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Tu pedido</p>
      <div className="mt-3 space-y-2.5 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-ink">Mensualidad</p>
            <p className="text-xs text-muted first-letter:uppercase">
              {formatearPeriodo(mensualidad.periodo)}
              {vence && ` · vence ${vence}`}
            </p>
          </div>
          <p className="font-medium tabular-nums text-ink">{formatearMonto(mensualidad.monto)}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-body">Comisión de pago</p>
          <p className="font-medium text-success">Sin costo</p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
        <p className="text-sm text-body">Total a pagar</p>
        <p className="text-2xl font-bold tabular-nums tracking-tight text-ink">{formatearMonto(mensualidad.monto)}</p>
      </div>
    </div>
  );
}

function CampoTexto({ etiqueta, error, icono, extra, children }: { etiqueta: ReactNode; error?: string; icono: ReactNode; extra?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className={claseEtiqueta}>{etiqueta}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted [&>svg]:h-[18px] [&>svg]:w-[18px]">{icono}</span>
        {children}
        {extra && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">{extra}</span>}
      </span>
      {error && <span className="mt-1.5 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

function BotonPrueba({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] text-body transition hover:border-primary-light hover:text-ink">
      {children}
    </button>
  );
}

function EstadoSimple({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 p-8 text-center">{children}</div>;
}

/* ---------------------------------------------------------------- */

interface AutorizacionProps {
  fase: Exclude<Fase, "formulario">;
  brillo: BrilloTarjeta;
  tarjeta: { digitos: string; marca: ReturnType<typeof detectarMarca>; titular: string; vencimiento: string; cvc: string };
  etiquetaTarjeta: string;
  resultado: { pago?: PagoMensualidad; mensaje?: string; monto: number };
  onReintentar: () => void;
}

function Autorizacion({ fase, brillo, tarjeta, etiquetaTarjeta, resultado, onReintentar }: AutorizacionProps) {
  const monto = formatearMonto(resultado.monto);
  return (
    <div className="flex min-h-[540px] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#e8effb_0%,#dfe7f4_70%)] px-6 py-12 text-center dark:bg-[radial-gradient(ellipse_at_center,#13213f_0%,#0a1428_70%)]">
      <Tarjeta3D {...tarjeta} brillo={brillo} className="w-full max-w-[400px] animate-acercar" />

      <div className="mt-10 flex min-h-[132px] flex-col items-center" aria-live="polite">
        {fase === "procesando" && (
          <>
            <Loader2 className="h-7 w-7 animate-spin text-primary-light" strokeWidth={2} />
            <p className="mt-4 text-base font-semibold text-ink">Autorizando con tu banco</p>
            <p className="mt-1 text-sm text-body">
              {etiquetaTarjeta} · {monto}
            </p>
          </>
        )}

        {fase === "aprobado" && (
          <div className="flex animate-fade-up flex-col items-center">
            <CircleCheck className="h-8 w-8 text-success" strokeWidth={1.8} />
            <p className="mt-3 text-lg font-semibold text-ink">Pago aprobado · {monto}</p>
            <p className="mt-1 text-sm text-body">
              {etiquetaTarjeta}
              {resultado.pago?.codigoOperacion && <> · Operación {resultado.pago.codigoOperacion}</>}
            </p>
            <Link
              href={RUTA_MIS_PAGOS}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Ver mis pagos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {fase === "rechazado" && (
          <div className="flex animate-fade-up flex-col items-center">
            <CircleX className="h-8 w-8 text-danger" strokeWidth={1.8} />
            <p className="mt-3 text-lg font-semibold text-ink">Pago rechazado</p>
            <p className="mt-1 max-w-sm text-sm text-body">{resultado.mensaje}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onReintentar}
                className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Intentar con otra tarjeta
              </button>
              <Link href={RUTA_MIS_PAGOS} className="inline-flex h-11 items-center rounded-xl border border-line bg-surface px-6 text-sm font-semibold text-ink transition hover:bg-surface-muted">
                Volver a mis pagos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
