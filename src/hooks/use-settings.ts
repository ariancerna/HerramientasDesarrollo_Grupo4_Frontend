"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  DEFAULT_SETTINGS,
  Tema,
  getSettingsSnapshot,
  parseSettingsSnapshot,
  subscribeToSettings,
  updateSettings,
} from "@/store/settings-store";

export function useSettings() {
  const snapshot = useSyncExternalStore(
    subscribeToSettings,
    getSettingsSnapshot,
    () => null,
  );
  const settings = useMemo(() => parseSettingsSnapshot(snapshot), [snapshot]);

  const setTema = useCallback((tema: Tema) => updateSettings({ tema }), []);
  const setNotificacionesSilenciadas = useCallback(
    (notificacionesSilenciadas: boolean) => updateSettings({ notificacionesSilenciadas }),
    [],
  );

  return { settings: settings ?? DEFAULT_SETTINGS, setTema, setNotificacionesSilenciadas };
}
