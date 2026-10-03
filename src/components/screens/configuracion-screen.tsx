"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROLE_LABELS } from "@/constants/nav-items";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useSettings } from "@/hooks/use-settings";

type TabId = "club" | "apariencia" | "cuenta" | "seguridad";

const TABS: { id: TabId; label: string; icon: (className: string) => React.ReactNode }[] = [
  { id: "club", label: "Club", icon: (c) => <BuildingIcon className={c} /> },
  { id: "apariencia", label: "Apariencia", icon: (c) => <PaletteIcon className={c} /> },
  { id: "cuenta", label: "Cuenta", icon: (c) => <UserIcon className={c} /> },
  { id: "seguridad", label: "Seguridad", icon: (c) => <ShieldIcon className={c} /> },
];

export default function ConfiguracionScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("club");
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
          {TABS.map((tab) => {
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

      {activeTab === "club" && <ClubTab confirm={confirm} />}
      {activeTab === "apariencia" && <AparienciaTab />}
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
  const [form, setForm] = useState({
    nombre: "El Golazo Club",
    direccion: "",
    telefono: "",
    correo: "",
    horarioAtencion: "Lunes a Sábado, 3pm - 9pm",
    montoMensualidad: "180",
    diaVencimiento: "10",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGuardar() {
    await confirm({
      title: "Datos guardados",
      message:
        "Cuando el backend esté conectado, esto se guardará en la tabla configuracion_club.",
      confirmLabel: "Entendido",
      hideCancel: true,
    });
  }

  return (
    <SettingsCard
      title="Datos del club"
      description="Información general y reglas de mensualidad del club."
      icon={<BuildingIcon className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nombre del club">
          <input
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Teléfono / WhatsApp">
          <input
            value={form.telefono}
            onChange={(e) => update("telefono", e.target.value)}
            placeholder="+51 999 999 999"
            className={inputClass}
          />
        </Field>

        <Field label="Correo de contacto">
          <input
            type="email"
            value={form.correo}
            onChange={(e) => update("correo", e.target.value)}
            placeholder="contacto@elgolazoclub.pe"
            className={inputClass}
          />
        </Field>

        <Field label="Dirección">
          <input
            value={form.direccion}
            onChange={(e) => update("direccion", e.target.value)}
            placeholder="Av. Ejemplo 123"
            className={inputClass}
          />
        </Field>

        <Field label="Horario de atención" full>
          <input
            value={form.horarioAtencion}
            onChange={(e) => update("horarioAtencion", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Reglas de mensualidad
        </p>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Monto de mensualidad (S/)">
            <input
              type="number"
              min={0}
              value={form.montoMensualidad}
              onChange={(e) => update("montoMensualidad", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Día de vencimiento (1-28)">
            <input
              type="number"
              min={1}
              max={28}
              value={form.diaVencimiento}
              onChange={(e) => update("diaVencimiento", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleGuardar}
          className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark"
        >
          Guardar cambios
        </button>
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   TAB: APARIENCIA (lo que ya existía, reorganizado)
============================================================ */
function AparienciaTab() {
  const { settings, setTema, setNotificacionesSilenciadas } = useSettings();

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Apariencia"
        description="Elige cómo se ve el panel en este dispositivo."
        icon={<PaletteIcon className="h-5 w-5" />}
      >
        <ToggleRow
          label="Modo oscuro"
          description="Cambia los colores del panel a un tema oscuro."
          checked={settings.tema === "oscuro"}
          onChange={(checked) => setTema(checked ? "oscuro" : "claro")}
        />
      </SettingsCard>

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

  async function handleCambiarPassword() {
    await confirm({
      title: "Próximamente",
      message:
        "Cambiar contraseña estará disponible cuando se conecte el backend (endpoint AUTH-10).",
      confirmLabel: "Entendido",
      hideCancel: true,
    });
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Contraseña"
        description="Actualiza tu contraseña de acceso."
        icon={<LockIcon className="h-5 w-5" />}
      >
        <button
          type="button"
          onClick={handleCambiarPassword}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cambiar contraseña
        </button>
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

function PaletteIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-.9-.5-1.3-.3-.3-.5-.7-.5-1.2 0-1.1.9-2 2-2h2a3 3 0 0 0 3-3c0-5-3.6-8.5-8-8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" />
      <circle cx="14.5" cy="7.5" r="1.2" fill="currentColor" />
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