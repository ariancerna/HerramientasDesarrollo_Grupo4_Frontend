import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "@/components/forms/register-form";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* =========================================================
          FONDO COMPLETO
      ========================================================= */}
      <Image
        src="/login-fondo1.png"
        alt="El Golazo Club"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Oscurece ligeramente el fondo para que el contenido resalte */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Degradado adicional en la zona izquierda */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/15" />

      {/* =========================================================
          CONTENIDO PRINCIPAL
      ========================================================= */}
      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">

        {/* =======================================================
            PANEL IZQUIERDO (idéntico al login)
        ======================================================= */}
        <section className="flex w-full flex-1 flex-col justify-between px-6 py-8 text-white sm:px-10 lg:px-12 xl:px-16">

          {/* LOGO + NOMBRE */}
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl">
              <Image
                src="/logo-el-golazo-club.jpg"
                alt="El Golazo Club"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-medium tracking-wide text-white/90 sm:text-base">
                CLUB DEPORTIVO CULTURAL
              </p>

              <h2 className="text-2xl font-extrabold tracking-wide sm:text-3xl">
                EL GOLAZO CLUB
              </h2>

              <div className="mt-2 h-1 w-32 bg-primary" />
            </div>
          </div>

          {/* MENSAJE PRINCIPAL */}
          <div className="my-10 max-w-xl lg:my-0">
            <p className="text-base font-extrabold tracking-wide text-primary sm:text-lg">
              MÁS QUE UN CLUB,
            </p>

            <h1 className="mt-1 text-4xl font-extrabold leading-[1.08] sm:text-5xl xl:text-6xl">
              UNA FAMILIA,
              <br />
              <span className="text-primary">UN PROPÓSITO</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              Impulsamos el talento y la pasión deportiva,
              formando atletas disciplinados a darlo todo
              dentro y fuera de la cancha.
            </p>

            {/* CARACTERÍSTICAS */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-7 w-7 text-primary" />
                <span>
                  Formación
                  <br />
                  Deportiva
                </span>
              </div>

              <div className="hidden h-10 w-px bg-white/30 sm:block" />

              <div className="flex items-center gap-2">
                <TrophyIcon className="h-7 w-7 text-primary" />
                <span>
                  Disciplina
                  <br />
                  y Valores
                </span>
              </div>

              <div className="hidden h-10 w-px bg-white/30 sm:block" />

              <div className="flex items-center gap-2">
                <StarIcon className="h-7 w-7 text-primary" />
                <span>
                  Grandes
                  <br />
                  Logros
                </span>
              </div>
            </div>
          </div>

          {/* CONTACTO */}
          <div className="max-w-xl border-t border-white/30 pt-5 text-sm text-white/85">
            <p className="mb-3 text-sm font-extrabold tracking-wide text-white">
              CONTÁCTANOS
            </p>

            <div className="space-y-2">
              <a
                href="https://wa.me/message/QOWSTIZGBL72H1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-primary"
              >
                <Image
                  src="/wsp.png"
                  alt="WhatsApp"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] object-contain"
                />
                994 796 381
              </a>

              <p className="flex items-center gap-2">
                <Image
                  src="/phone.png"
                  alt="Teléfono"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] object-contain"
                />
                998 678 259
              </p>

              <p className="flex items-start gap-2">
                <Image
                  src="/location.png"
                  alt="Ubicación"
                  width={18}
                  height={18}
                  className="mt-0.5 h-[18px] w-[18px] object-contain"
                />

                <span>
                  Plaza Cívica Pro - Los Olivos. Av. Honestidad Mz. D Lte 7
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================
            PANEL DERECHO / CREAR CUENTA
        ======================================================= */}
        <main className="flex w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[48%] lg:px-10 xl:w-[46%]">

          <div className="w-full max-w-[550px] rounded-[28px] border border-white/70 bg-white/95 p-7 shadow-2xl backdrop-blur-md sm:p-9 lg:p-10">

            {/* LOGO */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-md">
                <Image
                  src="/logo-el-golazo-club.jpg"
                  alt="El Golazo Club"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
                CLUB DEPORTIVO CULTURAL
              </p>

              <p className="text-lg font-extrabold text-slate-900">
                EL GOLAZO CLUB
              </p>

              <div className="mx-auto mt-2 h-1 w-16 bg-primary" />
            </div>

            {/* TÍTULO */}
            <div className="mb-7 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Crear cuenta
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Regístrate para solicitar tu acceso al club
              </p>
            </div>

            {/* FORMULARIO */}
            <RegisterForm />

            {/* VOLVER AL LOGIN */}
            <p className="mt-7 text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="font-bold text-primary transition hover:opacity-80"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===============================================================
    ICONOS
=============================================================== */

function UsersIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.8-3.3 2.7-5 5.5-5s4.7 1.7 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" />
      <path d="M17 14c1.8.6 3 2.1 3.5 4.5" />
    </svg>
  );
}

function TrophyIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5v2a3 3 0 0 0 3 3" />
      <path d="M16 6h3v2a3 3 0 0 1-3 3" />
      <path d="M12 12v4" />
      <path d="M8 20h8" />
      <path d="M10 16h4" />
    </svg>
  );
}

function StarIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}