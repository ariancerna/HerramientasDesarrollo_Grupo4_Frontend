import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "@/components/forms/register-form";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <div className="min-h-screen min-h-dvh w-full bg-bg-auth px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-4xl">
        {/* ENCABEZADO */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-1 ring-border">
            <Image
              src="/logo-el-golazo-club.jpg"
              alt="El Golazo Club"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>

          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
            Registro de alumno
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Crear cuenta en El Golazo Club
          </h1>

          <p className="mx-auto mt-1.5 max-w-md text-sm text-body">
            Completa tus datos para solicitar tu acceso al club.
          </p>
        </div>

        {/* TARJETA */}
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
            {/* PANEL IZQUIERDO — BENEFICIOS */}
            <aside className="hidden flex-col justify-between border-r border-border bg-bg-auth p-8 md:flex">
              <div>
                <h2 className="text-lg font-extrabold text-ink">
                  Tu portal del club
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  Regístrate para consultar tu asistencia, tus pagos y las
                  novedades de tu categoría.
                </p>

                <div className="mt-6 space-y-3">
                  <BenefitRow
                    icon={<UsersIcon className="h-5 w-5" />}
                    title="Tu progreso deportivo"
                    description="Consulta tu asistencia y evaluaciones"
                  />
                  <BenefitRow
                    icon={<TrophyIcon className="h-5 w-5" />}
                    title="Calendario de entrenamientos"
                    description="Entérate de tus próximas sesiones y eventos"
                  />
                  <BenefitRow
                    icon={<StarIcon className="h-5 w-5" />}
                    title="Soporte del club"
                    description="Contáctanos ante cualquier duda"
                  />
                </div>
              </div>

              <div className="mt-8 h-1 w-16 rounded-full bg-primary" />
            </aside>

            {/* PANEL DERECHO — FORMULARIO */}
            <div className="p-6 sm:p-8">
              <RegisterForm />
            </div>
          </div>
        </div>

        {/* VOLVER AL LOGIN */}
        <p className="mt-6 text-center text-sm text-body">
          ¿Ya tienes cuenta?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-bold text-primary transition hover:opacity-80"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

/* FILA DE BENEFICIO (panel izquierdo) */
function BenefitRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs text-body">{description}</p>
      </div>
    </div>
  );
}

/* ICONOS */

function UsersIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
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
      strokeWidth="1.8"
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
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}