"use client";
import Image from "next/image";
import Link from "next/link";
import { AuthCarousel } from "@/components/ui/auth-carousel";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { ROUTES } from "@/constants/routes";

const SLIDES = [
  { src: "/login-fondo.png", alt: "Entrenamiento de El Golazo Club" },
];

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full bg-bg">
      <section className="relative hidden overflow-hidden md:flex md:w-1/2">
        <AuthCarousel slides={SLIDES} />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-contrast/85 via-contrast/55 to-contrast/90" />

        <div className="relative z-20 flex w-full flex-col justify-center px-10 py-10 text-white">
          <div className="mb-8 flex justify-center">
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
          <h1 className="text-center text-3xl font-extrabold leading-[1.15]">
            Recupera el acceso
            <br />a tu cuenta
          </h1>
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
          <h2 className="text-center text-2xl font-bold text-ink">¿Olvidaste tu contraseña?</h2>
          <p className="mb-8 mt-1.5 text-center text-sm text-body">
            Ingresa tu correo y te enviaremos instrucciones para restablecerla
          </p>

          <ForgotPasswordForm />

          <p className="mt-8 text-center text-sm text-body">
            <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:text-primary-hover">
              ← Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}