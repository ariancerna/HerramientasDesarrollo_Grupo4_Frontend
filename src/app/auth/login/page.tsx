import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/forms/login-form";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  return (
    <AuthShell
      titulo="Iniciar sesión"
      subtitulo="Ingresa tus credenciales para acceder al sistema de gestión del club."
      pie={
        <>
          ¿Eres alumno y aún no tienes cuenta?{" "}
          <Link href={ROUTES.REGISTER} className="font-semibold text-primary-light hover:underline dark:text-blue-300">
            Regístrate
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
