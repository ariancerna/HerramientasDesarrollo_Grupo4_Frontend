import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full bg-bg-auth">
      <section className="relative hidden overflow-hidden md:flex md:w-1/2">
        <Image
          src="/login-fondo.png"
          alt="Entrenamiento de El Golazo Club"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 0px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-contrast/85 via-contrast/55 to-contrast/90" />

        <div className="relative z-10 flex w-full flex-col justify-center px-10 py-10 text-white">
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

      <main className="flex w-full items-center justify-center px-6 py-10 md:w-1/2 md:px-10">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-10 shadow-popover md:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-extrabold tracking-tight text-ink">¿Olvidaste tu contraseña?</h2>
            <p className="mt-1.5 text-sm text-body">
              Ingresa tu correo y te enviaremos instrucciones para restablecerla
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="mt-7 text-center text-sm text-body">
            <Link href={ROUTES.LOGIN} className="font-bold text-primary-dark hover:text-primary-hover">
              ← Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
