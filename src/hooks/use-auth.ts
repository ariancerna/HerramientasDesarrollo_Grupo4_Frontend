import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { MOCK_USUARIOS } from "@/lib/mock/usuarios.mock";
import {
  clearSession,
  getSessionSnapshot,
  isSessionExpired,
  parseSessionSnapshot,
  saveSession,
  subscribeToSession,
  touchSession,
} from "@/store/auth-store";
import { Role, Session } from "@/types";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll"] as const;
const CHECK_INTERVAL_MS = 15 * 1000;

interface LoginParams {
  usuario: string;
  password: string;
}

interface LoginResult {
  ok: boolean;
  error?: string;
  rol?: Role;
}

export function useAuth() {
  const snapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    () => null,
  );
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const parsedSession = useMemo(() => parseSessionSnapshot(snapshot), [snapshot]);
  const session: Session | null =
    parsedSession && !isSessionExpired(parsedSession) ? parsedSession : null;
  const isLoading = !isHydrated;
  const lastTouchRef = useRef(0);

  const login = useCallback(({ usuario, password }: LoginParams): LoginResult => {
    const match = MOCK_USUARIOS.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (!match) {
      return { ok: false, error: "Usuario o contraseña incorrectos." };
    }

    const usuarioSinPassword = {
      id: match.id,
      usuario: match.usuario,
      nombre: match.nombre,
      rol: match.rol,
      estudianteId: match.estudianteId,
    };
    saveSession(usuarioSinPassword);
    return { ok: true, rol: usuarioSinPassword.rol };
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  // Reinicia el contador de inactividad ante actividad del usuario
  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastTouchRef.current < 30_000) return;
      lastTouchRef.current = now;
      touchSession();
    };

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, handleActivity));
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [session]);

  // Revisa periódicamente si la sesión expiró por inactividad (US-02)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const current = parseSessionSnapshot(getSessionSnapshot());
      if (isSessionExpired(current)) {
        clearSession();
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [session]);

  return { session, isLoading, login, logout };
}
