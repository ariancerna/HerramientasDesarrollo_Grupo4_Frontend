import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleCallback } from "@/components/auth/google-callback";
import { ROUTES } from "@/constants/routes";

export default function AuthCallbackPage() {
  return (
    <AuthShell
      titulo="Acceso con Google"
      subtitulo="Estamos verificando tu cuenta de Google con el club."
      volver={{ href: ROUTES.LOGIN, etiqueta: "Volver a iniciar sesión" }}
    >
      <GoogleCallback />
    </AuthShell>
  );
}
