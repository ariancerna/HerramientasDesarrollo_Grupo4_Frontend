"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, CreditCard, MapPin, Phone, QrCode, ShieldCheck } from "lucide-react";
import { ThemeMenu } from "@/components/shared/theme-menu";

const FUNCIONES = [
  { Icono: QrCode, titulo: "Asistencia con código QR", texto: "Registro rápido en cada entrenamiento." },
  { Icono: CreditCard, titulo: "Pagos y mensualidades", texto: "Control claro de cobros y deudas." },
  { Icono: CalendarDays, titulo: "Calendario y evaluaciones", texto: "Actividades y progreso de cada alumno." },
];

// Corte diagonal del panel de marca; la franja azul usa el mismo polígono un poco más ancha.
const DIAGONAL = "polygon(0 0, 100% 0, 76% 100%, 0 100%)";

interface AuthShellProps {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  /** Contenido bajo la tarjeta (enlaces secundarios). */
  pie?: ReactNode;
  /** Enlace superior para volver (por defecto, a la portada). */
  volver?: { href: string; etiqueta: string };
}

/**
 * Estructura común de las pantallas de acceso. El panel de marca cambia junto
 * con el tema elegido: en modo oscuro se vuelve más profundo y sobrio.
 */
export function AuthShell({ titulo, subtitulo, children, pie, volver = { href: "/", etiqueta: "Volver al inicio" } }: AuthShellProps) {
  return (
    <main className="relative min-h-screen min-h-dvh overflow-x-hidden bg-bg-auth">
      {/* ================= Panel de marca ================= */}
      <div aria-hidden className="absolute inset-y-0 left-0 hidden w-[calc(42%+26px)] md:block lg:w-[calc(54%+30px)]" style={{ clipPath: DIAGONAL }}>
        <div className="h-full w-full bg-gradient-to-b from-blue-500 via-blue-500/60 to-transparent dark:from-blue-600/70 dark:via-blue-700/30" />
      </div>
      <section className="absolute inset-y-0 left-0 hidden w-[42%] overflow-hidden text-white md:block lg:w-[54%]" style={{ clipPath: DIAGONAL }}>
        <Image src="/login-fondo1.png" alt="" fill priority sizes="(min-width: 1024px) 54vw, 42vw" className="scale-105 object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#081634]/95 via-[#0e2457]/80 to-[#1e3a8a]/45 transition-colors duration-500 dark:from-[#03070f]/97 dark:via-[#060d1d]/90 dark:to-[#0b1730]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061128]/90 via-transparent to-[#061128]/40 dark:from-black/90" />

        <div className="relative flex h-full max-w-[560px] flex-col px-8 py-10 lg:px-12 xl:px-14">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-el-golazo-club.jpg"
              alt="Escudo de El Golazo Club"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover shadow-[0_4px_14px_rgb(0_0_0/0.4)] ring-2 ring-white/80"
            />
            <div>
              <p className="text-[28px] font-bold leading-none tracking-tight">
                El Golazo <span className="text-blue-300">Club</span>
              </p>
              <p className="mt-1.5 text-sm text-white/75">Club Deportivo Cultural</p>
            </div>
          </div>

          <div className="my-auto">
            <h1 className="max-w-[16ch] text-[30px] font-bold leading-[1.12] tracking-tight lg:text-[38px] xl:text-[42px]">
              Más que un club,
              <span className="block text-blue-300">una familia con propósito.</span>
            </h1>
            <p className="mt-4 hidden max-w-md text-[17px] leading-7 text-white/80 lg:block">
              Gestiona alumnos, asistencia, pagos y actividades de tus categorías desde un solo lugar.
            </p>

            <ul className="mt-9 hidden space-y-4 lg:block">
              {FUNCIONES.map(({ Icono, titulo: tituloFuncion, texto }) => (
                <li key={tituloFuncion} className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
                    <Icono className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold">{tituloFuncion}</p>
                    <p className="text-[13px] text-white/65">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden space-y-1.5 text-[13px] text-white/70 lg:block">
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> 994 796 381 · 998 678 259
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Plaza Cívica Pro, Los Olivos. Av. Honestidad Mz. D Lt. 7
            </p>
          </div>
        </div>
      </section>

      {/* ================= Formulario ================= */}
      <div className="relative grid min-h-screen min-h-dvh md:grid-cols-[42%_58%] lg:grid-cols-[54%_46%]">
        <div className="hidden md:block" />

        <section className="flex flex-col px-5 py-6 sm:px-8 md:pl-14 lg:pl-16">
          <div className="flex items-center justify-between gap-3">
            <Link href={volver.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-body transition-colors hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> {volver.etiqueta}
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-xs text-muted sm:flex">
                <ShieldCheck className="h-3.5 w-3.5" /> Acceso seguro al sistema
              </span>
              <ThemeMenu variante="outline" />
            </div>
          </div>

          <div className="mx-auto my-auto w-full max-w-[520px] animate-fade-up py-8">
            <div className="mb-6 flex items-center justify-center gap-3 md:hidden">
              <Image src="/logo-el-golazo-club.jpg" alt="Escudo de El Golazo Club" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
              <p className="text-2xl font-bold tracking-tight text-ink">El Golazo Club</p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-7 shadow-[0_24px_60px_-28px_rgb(15_27_51/0.35)] sm:p-11 dark:shadow-[0_24px_60px_-28px_rgb(0_0_0/0.8)]">
              <span className="block h-1 w-12 rounded-full bg-primary" />
              <h2 className="mt-6 text-[30px] font-bold tracking-tight text-ink">{titulo}</h2>
              <p className="mt-2 text-sm leading-6 text-body">{subtitulo}</p>
              <div className="mt-7">{children}</div>
            </div>

            {pie && <div className="mt-6 text-center text-sm text-body">{pie}</div>}
            <p className="mt-6 text-center text-xs text-muted">
              © {new Date().getFullYear()} El Golazo Club. Todos los derechos reservados.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
