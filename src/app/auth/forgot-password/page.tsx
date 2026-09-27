// src/app/auth/forgot-password/page.tsx
import Image from "next/image";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen min-h-dvh w-full items-center justify-center bg-bg-auth px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
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
            Recuperar acceso
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Recupera tu contraseña
          </h1>

          <p className="mx-auto mt-1.5 max-w-sm text-sm text-body">
            Ingresa tu correo y te enviaremos un código para recuperar el
            acceso a tu cuenta.
          </p>
        </div>

        {/* TARJETA */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
          <ForgotPasswordForm />
        </div>

        {/* VOLVER */}
        <p className="mt-6 text-center text-sm text-body">
          <Link
            href={ROUTES.LOGIN}
            className="font-bold text-primary transition hover:opacity-80"
          >
            ← Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}