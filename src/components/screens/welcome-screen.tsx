import Image from "next/image";
import Link from "next/link";
import { AuthCarousel } from "@/components/ui/auth-carousel";
import { ROUTES } from "@/constants/routes";

const SLIDES = [
  { src: "/login-fondo.png", alt: "Entrenamiento de El Golazo Club" },
];

const FEATURES = [
  { icon: AttendanceIcon, label: "Asistencia", desc: "Registro claro y rápido" },
  { icon: CategoryIcon, label: "Categorías", desc: "Organización por edades" },
  { icon: HistoryIcon, label: "Historial", desc: "Seguimiento centralizado" },
];

export function WelcomeScreen() {
  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center gap-6 overflow-hidden px-4 py-6 sm:gap-8 lg:py-8">
      <AuthCarousel slides={SLIDES} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-contrast/85 via-primary-dark/55 to-contrast/90" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-5 text-center sm:gap-6">
        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-28 sm:w-28">
          <Image
            src="/logo-el-golazo-club.jpg"
            alt="El Golazo Club"
            width={112}
            height={112}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <span className="rounded-full border border-primary/45 bg-primary/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-primary-light">
          El Golazo Club
        </span>

        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
          Tu pasión, <span className="text-primary">nuestro compromiso</span>
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
          Registra tu asistencia, consulta tu historial y sigue tu progreso deportivo
          desde un solo lugar.
        </p>

        <Link
          href={ROUTES.LOGIN}
          className="group mt-2 flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-base font-extrabold text-contrast shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover active:scale-95 sm:text-lg"
        >
          Ingresar al portal
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 transition-transform duration-200 group-hover:translate-x-1">
            <ArrowIcon className="h-5 w-5" />
          </span>
        </Link>
      </div>

      <div className="relative z-10 hidden w-full max-w-4xl grid-cols-3 gap-4 lg:grid">
        {FEATURES.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-white/18 bg-white/10 px-5 py-4 backdrop-blur-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/25 text-primary-light">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-extrabold text-white">{label}</p>
              <p className="text-sm text-white/65">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AttendanceIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 3v3M17 3v3M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.5 15 2 2 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategoryIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M11.5 3H5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .59 1.41l8.5 8.5a2 2 0 0 0 2.82 0l6.5-6.5a2 2 0 0 0 0-2.82l-8.5-8.5A2 2 0 0 0 11.5 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HistoryIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 3v5h5M3.05 13a9 9 0 1 0 2.13-7.14L3 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}