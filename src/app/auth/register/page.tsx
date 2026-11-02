import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/forms/register-form";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <AuthShell
      titulo="Crear tu cuenta"
      subtitulo="Si ya estás inscrito en el club, crea tu acceso con tu DNI para consultar tu asistencia, tus pagos y tu código QR de ingreso."
      volver={{ href: ROUTES.LOGIN, etiqueta: "Volver a iniciar sesión" }}
      pie={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href={ROUTES.LOGIN} className="font-semibold text-primary-light hover:underline dark:text-blue-300">
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
