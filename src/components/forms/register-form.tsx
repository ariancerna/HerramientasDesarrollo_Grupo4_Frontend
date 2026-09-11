"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useConfirm } from "@/hooks/use-confirm";

interface FormState {
  nombre: string;
  usuario: string;
  password: string;
  confirmarPassword: string;
}

interface FormErrors {
  nombre?: string;
  usuario?: string;
  password?: string;
  confirmarPassword?: string;
}

export function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    nombre: "",
    usuario: "",
    password: "",
    confirmarPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const { confirm, dialog } = useConfirm();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  }

  function validate() {
    const next: FormErrors = {};

    if (!form.nombre.trim()) {
      next.nombre = "El nombre es obligatorio.";
    }

    if (!form.usuario.trim()) {
      next.usuario = "El usuario es obligatorio.";
    }

    if (form.password.length < 6) {
      next.password = "Mínimo 6 caracteres.";
    }

    if (form.confirmarPassword !== form.password) {
      next.confirmarPassword = "Las contraseñas no coinciden.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);

      await confirm({
        title: "Cuenta creada",
        message:
          "Cuando el backend esté listo, esto quedará guardado de verdad.",
        confirmLabel: "Entendido",
        hideCancel: true,
      });

      router.push(ROUTES.LOGIN);
    }, 500);
  }

  const inputClass = (hasError?: string) =>
    `h-12 w-full rounded-xl border bg-[#f8fafb] px-4 text-[14px] text-[#172337] outline-none transition placeholder:text-[#9aa7b5] focus:border-[#00a94f] focus:bg-white focus:ring-4 focus:ring-[#00a94f]/10 ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
        : "border-[#e3e8ed]"
    }`;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* NOMBRE */}
        <div>
          <input
            name="nombre"
            type="text"
            autoComplete="name"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            className={inputClass(errors.nombre)}
          />

          {errors.nombre && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.nombre}
            </p>
          )}
        </div>

        {/* USUARIO */}
        <div>
          <input
            name="usuario"
            type="text"
            autoComplete="username"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Usuario"
            className={inputClass(errors.usuario)}
          />

          {errors.usuario && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.usuario}
            </p>
          )}
        </div>

        {/* CONTRASEÑA */}
        <div>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña (mínimo 6 caracteres)"
            className={inputClass(errors.password)}
          />

          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div>
          <input
            name="confirmarPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmarPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            className={inputClass(errors.confirmarPassword)}
          />

          {errors.confirmarPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.confirmarPassword}
            </p>
          )}
        </div>

        {/* BOTÓN CREAR CUENTA */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-13 w-full items-center justify-center rounded-xl bg-[#00a94f] px-6 text-[15px] font-bold text-white shadow-[0_5px_18px_rgba(0,169,79,0.28)] transition hover:bg-[#008f43] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      {/* SEPARADOR */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e5e9ee]" />

        <span className="text-xs font-medium text-[#9aa7b5]">
          O regístrate con
        </span>

        <div className="h-px flex-1 bg-[#e5e9ee]" />
      </div>

      {/* GOOGLE Y FACEBOOK */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e0e5ea] bg-white text-sm font-semibold text-[#344054] transition hover:bg-[#f8fafb]"
        >
          <GoogleIcon />
          Google
        </button>

        <button
          type="button"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e0e5ea] bg-white text-sm font-semibold text-[#344054] transition hover:bg-[#f8fafb]"
        >
          <FacebookIcon />
          Facebook
        </button>
      </div>

      {dialog}
    </>
  );
}

/* GOOGLE */
function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.79-.07-1.55-.2-2.28H12v4.32h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.88-1.73 2.99-4.28 2.99-7.57Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.22-2.51c-.89.6-2.03.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.06v2.59A9.98 9.98 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.89A6.01 6.01 0 0 1 6.08 12c0-.66.11-1.3.31-1.89V7.52H3.06A10 10 0 0 0 2 12c0 1.61.39 3.13 1.06 4.48l3.33-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.79.5 3.83 1.49l2.87-2.87C16.95 2.98 14.7 2 12 2a9.98 9.98 0 0 0-8.94 5.52l3.33 2.59C7.18 7.74 9.39 5.98 12 5.98Z"
      />
    </svg>
  );
}

/* FACEBOOK */
function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.09 4.39 23.07 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.04 1.79-4.72 4.54-4.72 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.07 24 18.09 24 12.07Z"
      />
    </svg>
  );
}