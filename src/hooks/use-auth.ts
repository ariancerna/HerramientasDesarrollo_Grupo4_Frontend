import { useCallback, useEffect, useState } from "react";
import { MOCK_USUARIOS } from "@/lib/mock/usuarios.mock";
import {
  clearSession,
  getSession,
  isSessionExpired,
  saveSession,
  touchSession,
} from "@/store/auth-store";
import { Session } from "@/types";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll"] as const;
const CHECK_INTERVAL_MS = 15 * 1000;

interface LoginParams {
  usuario: string;
  password: string;
}

interface LoginResult {
  ok: boolean;
  error?: string;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  // Evita parpadeos: en el primer render (servidor) no sabemos si hay
  // sesión, así que "isLoading" nos deja mostrar un estado neutral.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getSession();
    setSession(stored && !isSessionExpired(stored) ? stored : null);
    setIsLoading(false);
  }, []);

  const login = useCallback(({ usuario, password }: LoginParams): LoginResult => {
    const match = MOCK_USUARIOS.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (!match) {
      return { ok: false, error: "Usuario o contraseña incorrectos." };
    }

    const { password: _password, ...usuarioSinPassword } = match;
    const newSession = saveSession(usuarioSinPassword);
    setSession(newSession);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  // Reinicia el contador de inactividad ante actividad del usuario
  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      const updated = touchSession();
      if (updated) setSession(updated);
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
      const current = getSession();
      if (isSessionExpired(current)) {
        clearSession();
        setSession(null);
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [session]);

  return { session, isLoading, login, logout };
}
