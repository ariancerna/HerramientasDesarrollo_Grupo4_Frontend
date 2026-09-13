"use client";

import { useRouter } from "next/navigation";
import { ROLE_LABELS } from "@/constants/nav-items";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";

export default function ConfiguracionScreen() {
  const { session, logout } = useAuth();
  const { settings, setTema, setNotificacionesSilenciadas } = useSettings();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">AJUSTES</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personaliza cómo se ve y te avisa el sistema.
        </p>
      </header>

      <SettingsCard title="Apariencia" description="Elige cómo se ve el panel en este dispositivo.">
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
      >
        <ToggleRow
          label="Silenciar notificaciones"
          description="No mostrará el contador ni resaltará avisos nuevos, en escritorio ni en la app móvil."
          checked={settings.notificacionesSilenciadas}
          onChange={setNotificacionesSilenciadas}
        />
      </SettingsCard>

      <SettingsCard title="Cuenta" description="Información de la sesión activa.">
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
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
          >
            Cerrar sesión en este dispositivo
          </button>
        </div>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Por seguridad, la sesión se cierra automáticamente tras 15 minutos de inactividad.
        </p>
      </SettingsCard>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <h2 className="font-bold text-ink dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
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
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
          checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
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
