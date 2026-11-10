"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME_ROUTE } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * Supabase vuelve aquí con los tokens en el fragmento de la URL
 * (#access_token=...&refresh_token=...) o con #error=... si el usuario canceló.
 */
function leerFragmento() {
  const fragmento = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const consulta = new URLSearchParams(window.location.search);
  return {
    accessToken: fragmento.get("access_token"),
    refreshToken: fragmento.get("refresh_token"),
    error: fragmento.get("error_description") ?? consulta.get("error_description") ?? fragmento.get("error") ?? consulta.get("error"),
  };
}

export function GoogleCallback() {
  const { loginConGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const iniciado = useRef(false);

  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;

    const { accessToken, refreshToken, error: errorProveedor } = leerFragmento();
    // Los tokens no deben quedar en la barra de direcciones ni en el historial.
    window.history.replaceState(null, "", window.location.pathname);

    if (errorProveedor || !accessToken || !refreshToken) {
      queueMicrotask(() =>
        setError(errorProveedor ? "Se canceló el acceso con Google." : "No se recibió la sesión de Google. Intenta nuevamente."),
      );
      return;
    }

    void loginConGoogle(accessToken, refreshToken).then((resultado) => {
      if (resultado.ok && resultado.rol) {
        router.replace(ROLE_HOME_ROUTE[resultado.rol]);
      } else {
        setError(resultado.error ?? "No se pudo iniciar sesión con Google.");
      }
    });
  }, [loginConGoogle, router]);

  if (error) {
    return (
      <div className="space-y-5">
        <div role="alert" className="rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition hover:bg-primary-hover"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div role="status" className="flex flex-col items-center gap-3 py-8 text-sm text-muted">
      <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      Iniciando sesión con Google…
    </div>
  );
}
