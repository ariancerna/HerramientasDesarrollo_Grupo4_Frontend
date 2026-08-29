import Image from "next/image";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      <section
        className="relative flex flex-col justify-between overflow-hidden bg-cover bg-center px-10 py-10 text-white md:w-1/2"
        style={{ backgroundImage: "url('/login-fondo.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/85 via-[#0A1628]/60 to-[#0A1628]/85" />

        <div className="relative z-10 flex w-full justify-center">
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:h-44 md:w-44">
            <Image
              src="/logo-el-golazo-club.jpg"
              alt="El Golazo Club"
              width={176}
              height={176}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-base font-bold tracking-wide text-[#6FCF3A] md:text-lg">MÁS QUE UN CLUB,</p>
          <h1 className="mt-1 text-4xl font-extrabold leading-[1.15] text-white md:text-[42px]">
            UNA FAMILIA,
            <br />
            UN PROPÓSITO,
          </h1>
          <p className="mt-1 text-5xl text-[#6FCF3A] md:text-6xl" style={{ fontFamily: "var(--font-caveat)" }}>
            un golazo.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-200">
            Impulsamos el talento y la pasión por el voleibol, formando atletas dispuestos a darlo todo en cada set y fuera de la cancha.
          </p>
        </div>

        <div className="relative z-10 mt-8 w-full">
          <div className="space-y-3 border-t border-white/15 pt-5 text-sm text-gray-300">
            <p className="mb-1 text-sm font-bold tracking-wide text-[#6FCF3A]">CONTÁCTANOS Y DIRECCIÓN</p>
            <a href="https://wa.me/message/QOWSTIZGBL72H1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-white">
              <Image src="/wsp.png" alt="WhatsApp" width={17} height={17} className="h-[17px] w-[17px] object-contain invert" />
              994 796 381
            </a>
            <p className="flex items-center gap-2">
              <Image src="/phone.png" alt="Teléfono" width={15} height={15} className="h-[15px] w-[15px] rotate-180 object-contain" />
              998 678 259
            </p>
            <p className="flex items-start gap-2">
              <Image src="/location.png" alt="Ubicación" width={15} height={15} className="mt-0.5 h-[15px] w-[15px] object-contain" />
              <span>Plaza Cívica Pro - Los Olivos. Av. Honestidad Mz. D Lte 7</span>
            </p>
            <p className="pt-3 text-sm font-bold tracking-wide text-[#6FCF3A]">SÍGUENOS EN REDES</p>
            <a href="https://www.facebook.com/clubgolazo/about?locale=es_LA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-white">
              <Image src="/face.png" alt="Facebook" width={20} height={20} className="h-5 w-5 invert" />
              Club Deportivo El Golazo
            </a>
            <a href="https://www.tiktok.com/@clubdeportivoelgolazo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-white">
              <Image src="/tiktok.png" alt="TikTok" width={20} height={20} className="h-5 w-5 invert" />
              Club Deportivo El Golazo
            </a>
          </div>
        </div>
      </section>

      <main className="flex flex-col items-center justify-center px-8 py-16 md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="text-center text-2xl font-semibold text-[#16233C]">Iniciar sesión</h2>
          <p className="mb-8 mt-1 text-center text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
          <LoginForm />
          <p className="mt-10 text-center text-xs text-gray-400">© 2025 Golazo Club</p>
        </div>
      </main>
    </div>
  );
}
