import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Panel izquierdo — marca */}
      <div
        className="md:w-1/2 relative flex flex-col justify-between px-10 py-10 text-white bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('/login-fondo.png')` }}
      >
        {/* Overlay oscuro para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/85 via-[#0A1628]/60 to-[#0A1628]/85" />



        {/* Logo */}
        <div className="relative z-10 flex w-full justify-center">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden">
            <img
              src="/logo-el-golazo-club.jpg"
              alt="El Golazo Club"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mensaje central */}
        <div className="relative z-10 max-w-md">
          <p className="text-base md:text-lg font-bold text-[#6FCF3A] tracking-wide">
            MÁS QUE UN CLUB,
          </p>
          <h1 className="mt-1 text-4xl md:text-[42px] font-extrabold leading-[1.15] text-white">
            UNA FAMILIA,
            <br />
            UN PROPÓSITO,
          </h1>
          <p
            className="mt-1 text-5xl md:text-6xl text-[#6FCF3A]"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            un golazo.
          </p>

          <p className="mt-4 text-sm text-gray-200 max-w-sm leading-relaxed">
            Impulsamos el talento y la pasión por el voleibol, formando atletas dispuestos a darlo todo en cada set y fuera de la cancha.
          </p>
        </div>






   <div className="relative z-10 mb-16 w-full">
        {/* Contacto y dirección */}
        <div className="relative z-10 border-t border-white/15 pt-5 text-sm text-gray-300 space-y-3 -mt-16">
          <p className="text-[#6FCF3A] font-bold tracking-wide text-sm mb-1">
            CONTÁCTANOS Y DIRECCIÓN
          </p>

         <p className="flex items-center gap-2">
  <img 
    src="/phone.png" 
    alt="Teléfono" 
    className="w-[15px] h-[15px] rotate-180 object-contain" 
  />
            994 796 381 &nbsp;•&nbsp; 998 678 259
          </p>


    <p className="flex items-start gap-2">
  <img 
    src="/location.png" 
    alt="Ubicación" 
    className="w-[15px] h-[15px] object-contain mt-0.5" 
  />
  <span>Plaza Cívica Pro - Los Olivos. Av. Honestidad Mz. D Lte 7</span>
</p>

          <p className="text-[#6FCF3A] font-bold tracking-wide text-sm pt-3">
            SÍGUENOS EN REDES
          </p>

      <p className="flex items-center gap-2">
  <img src="/face.png" alt="Facebook" className="w-5 h-5 invert" />
  Club Deportivo El Golazo
</p>  
          <p className="flex items-center gap-2">
            <img src="/insta.png" alt="Instagram" className="w-5 h-5 invert" />
            Club Deportivo El Golazo
          </p>
        </div>
        </div>
      </div>





      {/* Panel derecho — formulario */}
      <div className="md:w-1/2 flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-[#16233C] text-center">
            Iniciar sesión
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1 mb-8">
            Ingresa tus credenciales para continuar
          </p>

          <LoginForm />

          <p className="mt-10 text-center text-xs text-gray-400">© 2025 Golazo Club</p>
        </div>
      </div>
    </div>
  );
}

function BallIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7l3 2.2-1.1 3.6H10.1L9 9.2 12 7zM12 3v4M12 17v4M4 8l3.5 1M20 8l-3.5 1M4 16l3.5-1M20 16l-3.5-1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}