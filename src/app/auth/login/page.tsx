import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
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
              MÁS QUE UN CLUB,
            </p>
            <h1 className="mt-1 text-3xl font-extrabold leading-[1.15] md:text-[38px]">
              UNA FAMILIA,
              <br />
              UN PROPÓSITO,
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              Impulsamos el talento y la pasión deportiva, formando atletas dispuestos a darlo
              todo dentro y fuera de la cancha.
            </p>
          </div>

          <div className="space-y-3 border-t border-white/15 pt-5 text-sm text-white/75">
            <p className="text-sm font-bold tracking-wide text-primary-light">CONTÁCTANOS</p>
            
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

      <main className="flex w-full items-center justify-center px-6 py-10 md:w-1/2 md:px-10">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-10 shadow-popover md:p-12">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
              <Image
                src="/logo-el-golazo-club.jpg"
                alt="El Golazo Club"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
              El Golazo Club
            </p>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-extrabold tracking-tight text-ink">Bienvenido</h2>
            <p className="mt-1.5 text-sm text-body">Inicia sesión para continuar</p>
          </div>

          <LoginForm />

          <p className="mt-7 text-center text-sm text-body">
            ¿No tienes cuenta?{" "}
            <Link href={ROUTES.REGISTER} className="font-bold text-primary-dark hover:text-primary-hover">
              Regístrate
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
