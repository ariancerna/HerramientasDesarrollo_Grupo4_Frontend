"use client";

// SCRUM-10 (US-03) Protected Application Access
// Envuelve rutas privadas: sin sesión válida (o rol no permitido), redirige al login.

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { Role } from "@/types";

interface RoleGuardProps {
  children: ReactNode;
  /** Si se omite, solo exige que haya sesión activa (sin importar el rol). */
  allowedRoles?: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session.usuario.rol)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [session, isLoading, allowedRoles, router]);

  // Evita parpadeo: mientras se confirma la sesión, no se muestra nada sensible.
  if (isLoading) {
    return <div className="p-8 text-sm text-gray-500">Cargando...</div>;
  }

  if (!session) return null;
  if (allowedRoles && !allowedRoles.includes(session.usuario.rol)) return null;

  return <>{children}</>;
}
