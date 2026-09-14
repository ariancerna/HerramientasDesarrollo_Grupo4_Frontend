import { isPlainObject, writeJson } from "@/lib/storage";

export type Tema = "claro" | "oscuro";

export interface Settings {
  tema: Tema;
  notificacionesSilenciadas: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  tema: "claro",
  notificacionesSilenciadas: false,
};

const STORAGE_KEY = "kickstamp-settings";
const SETTINGS_CHANGE_EVENT = "kickstamp:settings-change";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getSettingsSnapshot(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function subscribeToSettings(onStoreChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(SETTINGS_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SETTINGS_CHANGE_EVENT, onStoreChange);
  };
}

export function parseSettingsSnapshot(snapshot: string | null): Settings {
  if (!snapshot) return DEFAULT_SETTINGS;
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!isPlainObject(parsed)) return DEFAULT_SETTINGS;

    return {
      tema: parsed.tema === "oscuro" ? "oscuro" : "claro",
      notificacionesSilenciadas:
        typeof parsed.notificacionesSilenciadas === "boolean"
          ? parsed.notificacionesSilenciadas
          : DEFAULT_SETTINGS.notificacionesSilenciadas,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(cambios: Partial<Settings>): Settings {
  const actuales = parseSettingsSnapshot(getSettingsSnapshot());
  const siguientes = { ...actuales, ...cambios };
  if (isBrowser()) {
    writeJson(STORAGE_KEY, siguientes);
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  }
  return siguientes;
}
