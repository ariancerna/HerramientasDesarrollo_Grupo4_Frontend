"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import UserAvatar from "@/components/shared/user-avatar";
import { useAuth } from "@/hooks/use-auth";
import {
  actualizarPerfilAlumno,
  obtenerAlumnoPorId,
} from "@/store/alumnos-store";
import type { Student, StudentProfileData } from "@/types/student";

const MAX_FOTO_BYTES = 1_500_000;
const FORMATOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

type ErroresPerfil = Partial<
  Record<keyof StudentProfileData | "foto", string>
>;

export default function PerfilAlumnoPage() {
  const { session, actualizarUsuarioActual } = useAuth();
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId ? obtenerAlumnoPorId(estudianteId) : undefined;

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <header className="mb-6">
          <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">
            MI ESPACIO
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Mi perfil
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Mantén actualizados tus datos personales y consulta tu información deportiva.
          </p>
        </header>

        {!alumno ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            No se pudo identificar al alumno asociado a esta sesión.
          </div>
        ) : (
          <PerfilForm
            key={alumno.id}
            alumno={alumno}
            onNombreActualizado={actualizarUsuarioActual}
          />
        )}
      </div>
    </RoleGuard>
  );
}

function PerfilForm({
  alumno,
  onNombreActualizado,
}: {
  alumno: Student;
  onNombreActualizado: (nombre: string) => void;
}) {
  const datosIniciales = crearDatosPerfil(alumno);
  const [form, setForm] = useState<StudentProfileData>(datosIniciales);
  const [datosGuardados, setDatosGuardados] =
    useState<StudentProfileData>(datosIniciales);
  const [errores, setErrores] = useState<ErroresPerfil>({});
  const [mensaje, setMensaje] = useState("");
  const hayCambios = JSON.stringify(form) !== JSON.stringify(datosGuardados);

  const actualizarCampo = <K extends keyof StudentProfileData>(
    campo: K,
    valor: StudentProfileData[K],
  ) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
    setMensaje("");
  };

  const handleFoto = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo) return;

    if (!FORMATOS_FOTO.includes(archivo.type)) {
      setErrores((actuales) => ({
        ...actuales,
        foto: "Selecciona una imagen JPG, PNG o WebP.",
      }));
      return;
    }

    if (archivo.size > MAX_FOTO_BYTES) {
      setErrores((actuales) => ({
        ...actuales,
        foto: "La imagen no debe superar 1.5 MB.",
      }));
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      if (typeof lector.result !== "string") return;
      actualizarCampo("fotoUrl", lector.result);
      setErrores((actuales) => ({ ...actuales, foto: undefined }));
    };
    lector.onerror = () => {
      setErrores((actuales) => ({
        ...actuales,
        foto: "No se pudo leer la imagen seleccionada.",
      }));
    };
    lector.readAsDataURL(archivo);
  };

  const validar = () => {
    const nuevosErrores: ErroresPerfil = {};

    if (!form.nombres.trim()) {
      nuevosErrores.nombres = "Los nombres son obligatorios.";
    }
    if (!form.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    }
    if (!form.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nuevosErrores.email = "Ingresa un correo válido.";
    }
    if (form.telefono && !/^\d{9}$/.test(form.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener 9 dígitos.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validar()) return;

    const datosNormalizados: StudentProfileData = {
      ...form,
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      email: form.email.trim(),
      telefono: form.telefono?.trim() || undefined,
    };
    const actualizado = actualizarPerfilAlumno(alumno.id, datosNormalizados);

    if (!actualizado) {
      setMensaje("");
      setErrores({ nombres: "No se pudo actualizar el perfil." });
      return;
    }

    setForm(datosNormalizados);
    setDatosGuardados(datosNormalizados);
    setErrores({});
    setMensaje("Tus datos se actualizaron correctamente.");
    onNombreActualizado(`${actualizado.nombres} ${actualizado.apellidos}`);
  };

  const restaurar = () => {
    setForm(datosGuardados);
    setErrores({});
    setMensaje("");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
      <aside className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <UserAvatar
          nombre={`${form.nombres} ${form.apellidos}`}
          fotoUrl={form.fotoUrl}
          imageAlt={`Foto de perfil de ${form.nombres}`}
          className="mx-auto h-36 w-36 bg-primary text-4xl font-bold text-white ring-4 ring-[#edf8e8] dark:ring-emerald-500/20"
        />
        <h2 className="mt-5 text-xl font-bold text-ink dark:text-white">
          {form.nombres} {form.apellidos}
        </h2>
        <span className="mt-2 inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-dark dark:bg-emerald-500/15 dark:text-emerald-300">
          {alumno.categoria}
        </span>

        <div className="mt-5 flex flex-col gap-2">
          <label
            htmlFor="foto-perfil"
            className="cursor-pointer rounded-lg border border-primary px-4 py-2.5 text-sm font-bold text-primary-dark transition hover:bg-primary-soft dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
          >
            {form.fotoUrl ? "Cambiar foto" : "Agregar foto"}
          </label>
          <input
            id="foto-perfil"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFoto}
            className="sr-only"
          />
          {form.fotoUrl && (
            <button
              type="button"
              onClick={() => actualizarCampo("fotoUrl", undefined)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
            >
              Quitar foto
            </button>
          )}
        </div>
        {errores.foto && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
            {errores.foto}
          </p>
        )}
        <p className="mt-3 text-xs leading-5 text-slate-400 dark:text-slate-500">
          JPG, PNG o WebP. Máximo 1.5 MB.
        </p>

        <dl className="mt-6 divide-y divide-slate-100 border-t border-slate-100 text-left dark:divide-slate-800 dark:border-slate-800">
          <DatoSoloLectura etiqueta="Código" valor={alumno.codigo} />
          <DatoSoloLectura etiqueta="DNI" valor={alumno.dni} />
          <DatoSoloLectura etiqueta="Estado" valor={alumno.estado} capitalizar />
        </dl>
      </aside>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <div>
          <h2 className="font-bold text-ink dark:text-white">
            Datos personales
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            La categoría, el código y el DNI solo pueden ser modificados por administración.
          </p>
        </div>

        {mensaje && (
          <p
            role="status"
            className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <Campo
            id="nombres"
            etiqueta="Nombres"
            valor={form.nombres}
            error={errores.nombres}
            autoComplete="given-name"
            onChange={(valor) => actualizarCampo("nombres", valor)}
          />
          <Campo
            id="apellidos"
            etiqueta="Apellidos"
            valor={form.apellidos}
            error={errores.apellidos}
            autoComplete="family-name"
            onChange={(valor) => actualizarCampo("apellidos", valor)}
          />
          <Campo
            id="email"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={form.email}
            error={errores.email}
            autoComplete="email"
            className="sm:col-span-2"
            onChange={(valor) => actualizarCampo("email", valor)}
          />
          <Campo
            id="telefono"
            etiqueta="Teléfono"
            tipo="tel"
            valor={form.telefono ?? ""}
            error={errores.telefono}
            autoComplete="tel"
            inputMode="numeric"
            placeholder="987654321"
            onChange={(valor) =>
              actualizarCampo("telefono", valor.replace(/\D/g, "").slice(0, 9))
            }
          />
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Categoría asignada
            <input
              value={alumno.categoria}
              readOnly
              aria-readonly="true"
              className="h-11 cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            />
          </label>

          <div className="mt-2 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={restaurar}
              disabled={!hayCambios}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Descartar cambios
            </button>
            <button
              type="submit"
              disabled={!hayCambios}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 dark:focus:ring-offset-slate-900"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function crearDatosPerfil(alumno: Student): StudentProfileData {
  return {
    nombres: alumno.nombres,
    apellidos: alumno.apellidos,
    email: alumno.email,
    telefono: alumno.telefono,
    fotoUrl: alumno.fotoUrl,
  };
}

function DatoSoloLectura({
  etiqueta,
  valor,
  capitalizar = false,
}: {
  etiqueta: string;
  valor: string;
  capitalizar?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 text-sm">
      <dt className="text-slate-500 dark:text-slate-400">{etiqueta}</dt>
      <dd
        className={`truncate font-semibold text-slate-800 dark:text-slate-200 ${capitalizar ? "capitalize" : ""}`}
      >
        {valor}
      </dd>
    </div>
  );
}

function Campo({
  id,
  etiqueta,
  tipo = "text",
  valor,
  error,
  onChange,
  className = "",
  ...inputProps
}: {
  id: string;
  etiqueta: string;
  tipo?: string;
  valor: string;
  error?: string;
  onChange: (valor: string) => void;
  className?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
  placeholder?: string;
}) {
  return (
    <label htmlFor={id} className={className}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {etiqueta}
      </span>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:bg-slate-950 dark:text-white ${
          error
            ? "border-red-400 dark:border-red-500"
            : "border-slate-300 dark:border-slate-700"
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </label>
  );
}
