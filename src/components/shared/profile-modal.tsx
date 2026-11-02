"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AtSign, BadgeCheck, IdCard, Layers, Pencil, X } from "lucide-react";
import UserAvatar from "@/components/shared/user-avatar";
import { QrIngreso } from "@/components/shared/qr-ingreso";
import { ROLE_LABELS } from "@/constants/nav-items";
import { useAlumnos } from "@/store/alumnos-store";
import { useCategorias } from "@/store/categorias-store";
import type { Session } from "@/types";

interface ProfileModalProps {
  session: Session;
  onClose: () => void;
}

/** Ficha del usuario autenticado; el alumno ve además su QR de ingreso. */
export default function ProfileModal({ session, onClose }: ProfileModalProps) {
  const { usuario } = session;
  const alumnos = useAlumnos();
  const categorias = useCategorias();
  const alumno = usuario.estudianteId ? alumnos.find((item) => item.id === usuario.estudianteId) : undefined;
  const categoriasProfesor =
    usuario.rol === "profesor"
      ? categorias.filter((categoria) => categoria.profesorIds?.includes(usuario.id)).map((categoria) => categoria.nombre)
      : [];

  useEffect(() => {
    const alPresionarTecla = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [onClose]);

  const datos: { icono: typeof AtSign; etiqueta: string; valor: string }[] = [
    { icono: AtSign, etiqueta: "Usuario", valor: `@${usuario.usuario}` },
    { icono: BadgeCheck, etiqueta: "Rol", valor: ROLE_LABELS[usuario.rol] },
  ];
  if (alumno) {
    datos.push(
      { icono: IdCard, etiqueta: "DNI", valor: alumno.dni },
      { icono: Layers, etiqueta: "Categoría", valor: alumno.categoria || "Sin categoría asignada" },
    );
  }
  if (usuario.rol === "profesor") {
    datos.push({
      icono: Layers,
      etiqueta: "Categorías a cargo",
      valor: categoriasProfesor.length ? categoriasProfesor.join(", ") : "Sin categorías asignadas",
    });
  }

  // Portal a <body>: el encabezado usa backdrop-blur, que atraparía un elemento fixed.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="perfil-titulo"
        className="w-full max-w-md animate-fade-up overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-20px_rgb(7_13_26/0.5)]"
      >
        <div className="relative h-24 bg-gradient-to-r from-[#0b1730] via-[#1e3a8a] to-[#2563eb]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <UserAvatar
            nombre={usuario.nombre}
            fotoUrl={alumno?.fotoUrl}
            imageAlt={`Foto de ${usuario.nombre}`}
            className="-mt-10 h-20 w-20 bg-brand-green text-2xl font-bold text-white ring-4 ring-surface"
          />
          <div className="mt-3 min-w-0">
            <h2 id="perfil-titulo" className="truncate text-lg font-bold text-ink">
              {usuario.nombre}
            </h2>
            <p className="text-sm text-body">{ROLE_LABELS[usuario.rol]}</p>
          </div>

          <dl className="mt-5 divide-y divide-line rounded-xl border border-line">
            {datos.map(({ icono: Icono, etiqueta, valor }) => (
              <div key={etiqueta} className="flex items-center gap-3 px-4 py-3">
                <Icono className="h-4 w-4 shrink-0 text-muted" />
                <dt className="w-32 shrink-0 text-xs font-medium text-muted">{etiqueta}</dt>
                <dd className="min-w-0 truncate text-sm font-semibold text-ink">{valor}</dd>
              </div>
            ))}
          </dl>

          {alumno && (
            <section className="mt-6 rounded-xl bg-surface-muted p-5 text-center">
              <h3 className="text-sm font-bold text-ink">Tu código de ingreso</h3>
              <p className="mx-auto mb-4 mt-1 max-w-xs text-xs leading-5 text-body">
                Muéstralo al profesor al llegar al entrenamiento para registrar tu asistencia.
              </p>
              <QrIngreso dni={alumno.dni} nombre={usuario.nombre} tamano={180} />
            </section>
          )}

          {usuario.rol === "alumno" && (
            <Link
              href="/dashboard/alumno/perfil"
              onClick={onClose}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
            >
              <Pencil className="h-4 w-4" /> Editar mis datos
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
