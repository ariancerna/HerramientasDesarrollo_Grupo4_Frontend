import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const FEATURES = [
  { icon: AttendanceIcon, label: "Asistencia", desc: "Registro rápido" },
  { icon: HistoryIcon, label: "Historial", desc: "Consulta tu actividad" },
  { icon: CategoryIcon, label: "Categorías", desc: "Organización deportiva" },
];

export function WelcomeScreen() {
  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center gap-8 overflow-hidden px-4 py-10 sm:gap-10">
      {/* Fondo: cancha de vóley */}
      <Image
        src="/fondo-welcome.png"
        alt="Cancha de vóley El Golazo Club"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay para legibilidad, coherente con el navy + verde institucional */}
      <div className="absolute inset-0 bg-gradient-to-b from-contrast/80 via-contrast/55 to-contrast/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32">
          <Image
            src="/logo-voley.png"
            alt="El Golazo Club"
            fill
            priority
            sizes="128px"
            className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
          />
        </div>

        <span className="rounded-full border border-primary/45 bg-primary/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-primary-light">
          El Golazo Club
        </span>

        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
          Bienvenido a tu <span className="text-primary-light">portal deportivo</span>
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
          Gestiona tu asistencia, consulta tu historial y mantente al día con tu actividad
          deportiva, todo desde un solo lugar.
        </p>

        <Link
          href={ROUTES.LOGIN}
          className="group mt-2 flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-base font-extrabold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover active:scale-95 sm:text-lg"
        >
          Ingresar al portal
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 transition-transform duration-200 group-hover:translate-x-1">
            <ArrowIcon className="h-5 w-5" />
          </span>
        </Link>
      </div>

      <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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

      <p className="relative z-10 text-xs text-white/50">© El Golazo Club</p>
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