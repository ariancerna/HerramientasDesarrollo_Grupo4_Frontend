import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F7F9F7]">
      {/* Panel izquierdo — marca */}
      <div className="md:w-1/2 bg-[#0D2B21] text-white flex flex-col items-center justify-center px-10 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#16794C] flex items-center justify-center mb-6">
          <BallIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-wide">KICKSTAMP</h1>
        <p className="mt-3 text-sm text-[#B9CFC3] max-w-xs">
          Sistema Inteligente de Control de Asistencia del Golazo Club
        </p>
        <p className="mt-8 text-xs text-[#7FA491] italic">
          Disciplina hoy, mejores jugadores mañana.
        </p>
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