import { useCallback, useState } from "react";
import { api, mensajeError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { actualizarFotoPerfil, useAlumnos } from "@/store/alumnos-store";

const MAX_FOTO_BYTES = 1.5 * 1024 * 1024;
const FORMATOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

/** Valida la imagen antes de subirla; devuelve el mensaje de error o null. */
export function validarFoto(archivo: File): string | null {
  if (!FORMATOS_FOTO.includes(archivo.type)) return "Selecciona una imagen JPG, PNG o WebP.";
  if (archivo.size > MAX_FOTO_BYTES) return "La imagen no debe superar 1.5 MB.";
  return null;
}

/**
 * Foto de perfil del usuario autenticado. El alumno la guarda en su ficha
 * (/me/perfil/foto); profesores y administradores, en su cuenta (/auth/me/foto).
 */
export function useFotoPerfil() {
  const { session, actualizarFotoActual } = useAuth();
  const alumnos = useAlumnos();
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usuario = session?.usuario;
  const esAlumno = usuario?.rol === "alumno";
  const alumno = esAlumno ? alumnos.find((item) => item.id === usuario?.estudianteId) : undefined;
  const fotoUrl = esAlumno ? alumno?.fotoUrl : usuario?.fotoUrl;

  const cambiar = useCallback(
    async (archivo: File | null) => {
      if (archivo) {
        const problema = validarFoto(archivo);
        if (problema) {
          setError(problema);
          return;
        }
      }

      setError(null);
      setSubiendo(true);
      try {
        if (esAlumno) {
          await actualizarFotoPerfil(archivo);
        } else if (archivo) {
          const formData = new FormData();
          formData.append("foto", archivo);
          const { fotoUrl: nueva } = await api<{ fotoUrl: string }>("/auth/me/foto", {
            method: "PUT",
            body: formData,
          });
          actualizarFotoActual(nueva);
        } else {
          await api("/auth/me/foto", { method: "DELETE" });
          actualizarFotoActual(undefined);
        }
      } catch (err) {
        setError(mensajeError(err, "No se pudo actualizar la foto de perfil."));
      } finally {
        setSubiendo(false);
      }
    },
    [esAlumno, actualizarFotoActual],
  );

  return { fotoUrl, subiendo, error, cambiar };
}
