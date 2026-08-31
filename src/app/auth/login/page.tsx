"use client";
import Image from "next/image";
import Link from "next/link";
import { AuthCarousel } from "@/components/ui/auth-carousel";
import { LoginForm } from "@/components/forms/login-form";
import { ROUTES } from "@/constants/routes";

const SLIDES = [
  { src: "/login-fondo.png", alt: "Entrenamiento de El Golazo Club" },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-bg">
      <section className="relative hidden overflow-hidden md:flex md:w-1/2">
        <AuthCarousel slides={SLIDES} />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-contrast/85 via-contrast/55 to-contrast/90" />

        <div className="relative z-20 flex w-full flex-col justify-between px-10 py-10 text-white">
          <div className="flex justify-center">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
              <Image
                src="/logo-el-golazo-club.jpg"
                alt="El Golazo Club"
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-sm font-bold tracking-wide text-primary md:text-base">MÁS QUE UN CLUB,</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-[1.15] md:text-[38px]">
              UNA FAMILIA,
              <br />
              UN PROPÓSITO,
            </h1>
            <p className="mt-1 text-4xl text-primary md:text-5xl" style={{ fontFamily: "var(--font-caveat)" }}>
              un golazo.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              Impulsamos el talento y la pasión deportiva, formando atletas dispuestos a darlo todo
              dentro y fuera de la cancha.
            </p>
          </div>

          <div className="space-y-3 border-t border-white/15 pt-5 text-sm text-white/75">
            <p className="text-sm font-bold tracking-wide text-primary">CONTÁCTANOS</p>

            <a
              href="https://wa.me/message/QOWSTIZGBL72H1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <Image src="/wsp.png" alt="WhatsApp" width={16} height={16} className="h-4 w-4 object-contain invert" />
              994 796 381
            </a>

            <p className="flex items-center gap-2">
              <Image src="/phone.png" alt="Teléfono" width={14} height={14} className="h-3.5 w-3.5 rotate-180 object-contain" />
              998 678 259
            </p>

            <p className="flex items-start gap-2">
              <Image src="/location.png" alt="Ubicación" width={14} height={14} className="mt-0.5 h-3.5 w-3.5 object-contain" />
              <span>Plaza Cívica Pro - Los Olivos. Av. Honestidad Mz. D Lte 7</span>
            </p>
          </div>
        </div>
      </section>

      <main className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2 md:px-12">
        <div className="mb-6 flex items-center gap-2 md:hidden">
          <Image
            src="/logo-el-golazo-club.jpg"
            alt="El Golazo Club"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-border object-cover"
          />
          <span className="text-sm font-bold text-ink">EL GOLAZO CLUB</span>
        </div>

        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card md:border-0 md:p-0 md:shadow-none">
          <h2 className="text-center text-2xl font-bold text-ink">Iniciar sesión</h2>
          <p className="mb-8 mt-1.5 text-center text-sm text-body">
            Ingresa tus credenciales para continuar
          </p>

          <LoginForm />

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted">o continúa con</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SocialButton provider="google" />
            <SocialButton provider="facebook" />
          </div>

          <p className="mt-8 text-center text-sm text-body">
            ¿No tienes cuenta?{" "}
            <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:text-primary-hover">
              Regístrate
            </Link>
          </p>
        </div>

        <p className="mt-10 text-center text-xs text-muted">© 2026 Golazo Club</p>
      </main>
    </div>
  );
}

function SocialButton({ provider }: { provider: "google" | "facebook" }) {
  const isGoogle = provider === "google";
  return (
    <button
      type="button"
      onClick={() => alert("La autenticación con " + (isGoogle ? "Google" : "Facebook") + " estará disponible cuando conectemos el backend.")}
      className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-semibold text-ink shadow-sm transition hover:bg-bg-subtle"
    >
      {isGoogle ? <GoogleIcon /> : <FacebookIcon />}
      {isGoogle ? "Google" : "Facebook"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.6l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z"
      />
    </svg>
  );
}