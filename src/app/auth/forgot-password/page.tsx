import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      titulo="Recuperar contraseña"
      subtitulo="Ingresa el correo registrado en tu cuenta y te enviaremos un código de verificación de 6 dígitos."
      volver={{ href: ROUTES.LOGIN, etiqueta: "Volver a iniciar sesión" }}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
