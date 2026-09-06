import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full bg-bg-auth">
      <section className="relative hidden overflow-hidden md:flex md:w-1/2">
        <Image
          src="/login-fondo.png"
          alt="Entrenamiento de El Golazo Club"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-contrast/85 via-contrast/55 to-contrast/90" />

        <div className="relative z-10 flex w-full flex-col justify-between px-10 py-10 text-white">
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
            <p className="text-sm font-bold tracking-wide text-primary-light md:text-base">
              ÚNETE A LA FAMILIA,
            </p>
            <h1 className="mt-1 text-3xl font-extrabold leading-[1.15] md:text-[38px]">
              CREA TU CUENTA
              <br />Y EMPIEZA A JUGAR
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              Regístrate para llevar el control de tu asistencia, tus categorías y tu progreso
              dentro del club.
            </p>
          </div>

          <p className="text-sm text-white/60">© 2026 Golazo Club</p>
        </div>
      </section>

      <main className="flex w-full items-center justify-center px-6 py-10 md:w-1/2 md:px-10">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-10 shadow-popover md:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-extrabold tracking-tight text-ink">Crear cuenta</h2>
            <p className="mt-1.5 text-sm text-body">Regístrate para solicitar tu acceso al club</p>
          </div>

          <RegisterForm />

          <p className="mt-7 text-center text-sm text-body">
            ¿Ya tienes cuenta?{" "}
            <Link href={ROUTES.LOGIN} className="font-bold text-primary-dark hover:text-primary-hover">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}