import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import {
  actualizarUsuarioSesion,
  clearSession,
  getSessionSnapshot,
  isSessionExpired,
  parseSessionSnapshot,
  saveSession,
  subscribeToSession,
  touchSession,
} from "@/store/auth-store";
import { Role, Session, Usuario } from "@/types";

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

type RolBackend = "ADM" | "PROF" | "ALU";

interface UsuarioBackend {
  id: string;
  usuario: string;
  nombre: string;
  rol: RolBackend;
  estudianteId?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  usuario: UsuarioBackend;
}

// El backend guarda el rol como código corto (tabla `usuarios`, check constraint
// ADM/PROF/ALU); el front usa el nombre completo en rutas y permisos.
const ROL_BACKEND_A_FRONTEND: Record<RolBackend, Role> = {
  ADM: "administrador",
  PROF: "profesor",
  ALU: "alumno",
};

function mapearUsuarioBackend(usuario: UsuarioBackend): Usuario {
  return {
    id: usuario.id,
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    rol: ROL_BACKEND_A_FRONTEND[usuario.rol],
    estudianteId: usuario.estudianteId,
  };
}

function normalizarCredencial(value: string): string {
  return value.trim();
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

  const login = useCallback(async ({ usuario, password }: LoginParams): Promise<LoginResult> => {
    const cleanUsuario = normalizarCredencial(usuario);
    const cleanPassword = normalizarCredencial(password);

    try {
      const result = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: { usuario: cleanUsuario, password: cleanPassword },
        skipAuth: true,
      });

      const usuario = mapearUsuarioBackend(result.usuario);

      saveSession(usuario, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      return { ok: true, rol: usuario.rol };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "No se pudo iniciar sesión. Intenta de nuevo.";
      return { ok: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const actualizarUsuarioActual = useCallback((nombre: string) => {
    actualizarUsuarioSesion({ nombre });
  }, []);

  useEffect(() => {
    if (isLoading || !snapshot) return;
    if (!parsedSession || isSessionExpired(parsedSession)) {
      clearSession();
    }
  }, [isLoading, snapshot, parsedSession]);

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

  return { session, isLoading, login, logout, actualizarUsuarioActual };
}
