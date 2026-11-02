"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ROLE_LABELS } from "@/constants/nav-items";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useSettings } from "@/hooks/use-settings";
import { api, mensajeError } from "@/lib/api";

type TabId = "club" | "notificaciones" | "cuenta" | "seguridad";

const TABS: { id: TabId; label: string; icon: (className: string) => React.ReactNode }[] = [
  { id: "club", label: "Club", icon: (c) => <BuildingIcon className={c} /> },
  { id: "notificaciones", label: "Notificaciones", icon: (c) => <BellIcon className={c} /> },
  { id: "cuenta", label: "Cuenta", icon: (c) => <UserIcon className={c} /> },
  { id: "seguridad", label: "Seguridad", icon: (c) => <ShieldIcon className={c} /> },
];

function esTab(valor: string | null): valor is TabId {
  return TABS.some((tab) => tab.id === valor);
}

// useSearchParams exige un límite de Suspense en las páginas prerenderizadas.
export default function ConfiguracionScreen() {
  return (
    <Suspense>
      <ConfiguracionContenido />
    </Suspense>
  );
}

function ConfiguracionContenido() {
  const tabInicial = useSearchParams().get("tab");
  const { session } = useAuth();
  const esAdmin = session?.usuario.rol === "administrador";
  const tabs = esAdmin ? TABS : TABS.filter((tab) => tab.id !== "club");
  const [activeTab, setActiveTab] = useState<TabId>(
    esTab(tabInicial) && tabs.some((tab) => tab.id === tabInicial) ? tabInicial : tabs[0].id,
  );
  const { confirm, dialog } = useConfirm();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ajustes generales del sistema de El Golazo Club.
        </p>
      </header>

      {/* TABS */}
      <div className="overflow-x-auto">
        <nav
          className="inline-flex min-w-max gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800"
          aria-label="Pestañas de configuración"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-brand-green text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }`}
              >
                {tab.icon("h-4 w-4")}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === "club" && esAdmin && <ClubTab confirm={confirm} />}
      {activeTab === "notificaciones" && <NotificacionesTab />}
      {activeTab === "cuenta" && <CuentaTab />}
      {activeTab === "seguridad" && <SeguridadTab confirm={confirm} />}

      {dialog}
    </div>
  );
}

/* ============================================================
   TAB: CLUB
   Estos campos corresponden 1 a 1 a la tabla `configuracion_club`
   del backend (monto_mensualidad, dia_vencimiento), más datos
   generales de contacto para mostrar en el sistema.
============================================================ */
function ClubTab({ confirm }: { confirm: ReturnType<typeof useConfirm>["confirm"] }) {
  const [monto, setMonto] = useState("");
  const [dia, setDia] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    // GET /configuracion/club responde con las columnas de la tabla (snake_case).
    api<{ monto_mensualidad: number; dia_vencimiento: number }>("/configuracion/club")
      .then((config) => {
        if (!vigente) return;
        setMonto(String(config.monto_mensualidad));
        setDia(String(config.dia_vencimiento));
      })
      .catch((err) => vigente && setError(mensajeError(err, "No se pudo cargar la configuración del club.")))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, []);

  async function handleGuardar() {
    const montoMensualidad = Number(monto);
    const diaVencimiento = Number(dia);
    if (!Number.isFinite(montoMensualidad) || montoMensualidad <= 0) {
      setError("El monto de la mensualidad debe ser mayor que cero.");
      return;
    }
    if (!Number.isInteger(diaVencimiento) || diaVencimiento < 1 || diaVencimiento > 28) {
      setError("El día de vencimiento debe estar entre 1 y 28.");
      return;
    }

    setError("");
    setGuardando(true);
    try {
      await api("/configuracion/club", { method: "PUT", body: { montoMensualidad, diaVencimiento } });
      await confirm({
        title: "Configuración guardada",
        message: "Las reglas de mensualidad se actualizaron correctamente.",
        confirmLabel: "Entendido",
        hideCancel: true,
      });
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar la configuración."));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Mensualidades"
        description="Monto base y día de vencimiento que se aplican a los nuevos cargos."
        icon={<BuildingIcon className="h-5 w-5" />}
      >
        {cargando ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando configuración…</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Monto de mensualidad (S/)">
              <input type="number" min="1" step="0.5" value={monto} onChange={(e) => setMonto(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Día de vencimiento (1 a 28)">
              <input type="number" min="1" max="28" value={dia} onChange={(e) => setDia(e.target.value)} className={inputClass} />
            </Field>
          </div>
        )}
        {error && <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleGuardar}
            disabled={cargando || guardando}
            className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Datos de contacto"
        description="Información pública del club que se muestra en la pantalla de acceso."
        icon={<BuildingIcon className="h-5 w-5" />}
      >
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {[
            ["Nombre", "El Golazo Club"],
            ["Teléfonos", "994 796 381 · 998 678 259"],
            ["Dirección", "Plaza Cívica Pro, Los Olivos. Av. Honestidad Mz. D Lt. 7"],
            ["Horario de atención", "Lunes a sábado, de 3:00 p. m. a 9:00 p. m."],
          ].map(([etiqueta, valor]) => (
            <div key={etiqueta}>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{etiqueta}</dt>
              <dd className="mt-0.5 font-semibold text-slate-800 dark:text-slate-100">{valor}</dd>
            </div>
          ))}
        </dl>
      </SettingsCard>
    </div>
  );
}

/* ============================================================
   TAB: NOTIFICACIONES
   (La apariencia clara/oscura se elige desde la barra superior.)
============================================================ */
function NotificacionesTab() {
  const { settings, setNotificacionesSilenciadas } = useSettings();

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Notificaciones"
        description="Controla los avisos que muestra la campana del panel."
        icon={<BellIcon className="h-5 w-5" />}
      >
        <ToggleRow
          label="Silenciar notificaciones"
          description="No mostrará el contador ni resaltará avisos nuevos, en escritorio ni en la app móvil."
          checked={settings.notificacionesSilenciadas}
          onChange={setNotificacionesSilenciadas}
        />
      </SettingsCard>
    </div>
  );
}

/* ============================================================
   TAB: CUENTA (lo que ya existía)
============================================================ */
function CuentaTab() {
  const { session } = useAuth();

  return (
    <SettingsCard
      title="Cuenta"
      description="Información de la sesión activa."
      icon={<UserIcon className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {session?.usuario.nombre}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Usuario: {session?.usuario.usuario} ·{" "}
            {session ? ROLE_LABELS[session.usuario.rol] : ""}
          </p>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   TAB: SEGURIDAD (cerrar sesión + lo que antes vivía en Cuenta)
============================================================ */
function SeguridadTab({ confirm }: { confirm: ReturnType<typeof useConfirm>["confirm"] }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Contraseña"
        description="Actualiza tu contraseña de acceso."
        icon={<LockIcon className="h-5 w-5" />}
      >
        <CambiarPasswordForm confirm={confirm} />
      </SettingsCard>

      <SettingsCard
        title="Sesión"
        description="Cierra tu sesión en este dispositivo."
        icon={<ShieldIcon className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Por seguridad, la sesión se cierra automáticamente tras 15 minutos
            de inactividad.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
          >
            Cerrar sesión en este dispositivo
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}

/** AUTH-10: cambia la contraseña de la cuenta autenticada pidiendo la actual. */
function CambiarPasswordForm({ confirm }: { confirm: ReturnType<typeof useConfirm>["confirm"] }) {
  const [abierto, setAbierto] = useState(false);
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cerrar = () => {
    setAbierto(false);
    setActual("");
    setNueva("");
    setConfirmar("");
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!actual) return setError("Ingresa tu contraseña actual.");
    if (nueva.length < 6) return setError("La nueva contraseña debe tener al menos 6 caracteres.");
    if (nueva !== confirmar) return setError("Las contraseñas no coinciden.");

    setError("");
    setGuardando(true);
    try {
      const { mensaje } = await api<{ mensaje: string }>("/auth/password", {
        method: "PATCH",
        body: { passwordActual: actual, passwordNueva: nueva },
      });
      cerrar();
      await confirm({ title: "Contraseña actualizada", message: mensaje, confirmLabel: "Entendido", hideCancel: true });
    } catch (err) {
      setError(mensajeError(err, "No se pudo cambiar la contraseña."));
    } finally {
      setGuardando(false);
    }
  };

  const botonSecundario =
    "rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800";
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

  if (!abierto) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className={botonSecundario}>
        Cambiar contraseña
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-md gap-3">
      <input type="password" autoComplete="current-password" placeholder="Contraseña actual" aria-label="Contraseña actual" value={actual} onChange={(e) => setActual(e.target.value)} className={inputClass} />
      <input type="password" autoComplete="new-password" placeholder="Nueva contraseña" aria-label="Nueva contraseña" value={nueva} onChange={(e) => setNueva(e.target.value)} className={inputClass} />
      <input type="password" autoComplete="new-password" placeholder="Confirmar nueva contraseña" aria-label="Confirmar nueva contraseña" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className={inputClass} />
      {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={guardando} className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark disabled:opacity-60">
          {guardando ? "Guardando..." : "Guardar contraseña"}
        </button>
        <button type="button" onClick={cerrar} className={botonSecundario}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

/* ============================================================
   PIEZAS COMPARTIDAS
============================================================ */

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function SettingsCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-green-soft text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">
            {icon}
          </span>
        )}
        <div>
          <h2 className="font-extrabold text-navy dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">{children}</div>
    </section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
          checked ? "bg-brand-green" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ICONOS */

function BuildingIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 21V5a1 1 0 0 1 1-1h6v17" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 21V10a1 1 0 0 1 1-1h5v12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 21h18M7 7h1m-1 3.5h1M7 14h1m5-4h1m-1 3.5h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 3.2 1 5 1.5 5.8a.8.8 0 0 1-.7 1.2H5.2a.8.8 0 0 1-.7-1.2C5 14 6 12.2 6 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.5 18a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ShieldIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}