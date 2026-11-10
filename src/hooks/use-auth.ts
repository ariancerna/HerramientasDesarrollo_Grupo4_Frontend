import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { api, clearTokens, getTokens, mensajeError, saveTokens } from "@/lib/api";
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

/** Usuario autenticado tal como lo devuelve GET /auth/me. */
interface UsuarioApi {
  id: string;
  usuario: string;
  nombre: string;
  rol: "ADM" | "PROF" | "ALU";
  estudianteId?: string;
  fotoUrl?: string;
}

const ROLES_API: Record<UsuarioApi["rol"], Role> = {
  ADM: "administrador",
  PROF: "profesor",
  ALU: "alumno",
};

function normalizarCredencial(value: string): string {
  return value.trim();
}

/** Guarda los tokens, consulta GET /auth/me y crea la sesión local. */
async function iniciarSesionConTokens(tokens: { accessToken: string; refreshToken: string }): Promise<LoginResult> {
  saveTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  const me = await api<UsuarioApi>("/auth/me");
  const usuarioSesion: Usuario = {
    id: me.id,
    usuario: me.usuario,
    nombre: me.nombre,
    rol: ROLES_API[me.rol],
    estudianteId: me.estudianteId,
    fotoUrl: me.fotoUrl,
  };
  saveSession(usuarioSesion);
  return { ok: true, rol: usuarioSesion.rol };
}

function cerrarSesionLocal() {
  clearTokens();
  clearSession();
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
  // Una sesión solo es válida si conserva los tokens emitidos por el backend.
  const isRecognizedSession = useMemo(
    () => Boolean(parsedSession && getTokens()),
    [parsedSession],
  );
  const session: Session | null =
    parsedSession && isRecognizedSession && !isSessionExpired(parsedSession)
      ? parsedSession
      : null;
  const isLoading = !isHydrated;
  const lastTouchRef = useRef(0);

  const login = useCallback(async ({ usuario, password }: LoginParams): Promise<LoginResult> => {
    try {
      const tokens = await api<{ accessToken: string; refreshToken: string }>("/auth/login", {
        method: "POST",
        body: { usuario: normalizarCredencial(usuario), password: normalizarCredencial(password) },
        auth: false,
      });
      return await iniciarSesionConTokens(tokens);
    } catch (error) {
      clearTokens();
      return { ok: false, error: mensajeError(error, "Usuario o contraseña incorrectos.") };
    }
  }, []);

  /** Acceso con Google: canjea los tokens que entregó Supabase por la sesión del club. */
  const loginConGoogle = useCallback(async (accessToken: string, refreshToken: string): Promise<LoginResult> => {
    try {
      const sesion = await api<{ accessToken: string; refreshToken: string }>("/auth/google", {
        method: "POST",
        body: { accessToken, refreshToken },
        auth: false,
      });
      return await iniciarSesionConTokens(sesion);
    } catch (error) {
      clearTokens();
      return { ok: false, error: mensajeError(error, "No se pudo iniciar sesión con Google.") };
    }
  }, []);

  const logout = useCallback(() => {
    if (getTokens()) {
      void api("/auth/logout", { method: "POST" }).catch(() => undefined);
    }
    cerrarSesionLocal();
  }, []);

  const actualizarUsuarioActual = useCallback((nombre: string) => {
    actualizarUsuarioSesion({ nombre });
  }, []);

  const actualizarFotoActual = useCallback((fotoUrl: string | undefined) => {
    actualizarUsuarioSesion({ fotoUrl });
  }, []);

  useEffect(() => {
    if (isLoading || !snapshot) return;
    if (!parsedSession || !isRecognizedSession || isSessionExpired(parsedSession)) {
      cerrarSesionLocal();
    }
  }, [isLoading, snapshot, parsedSession, isRecognizedSession]);

  // Si el backend rechaza el token y no se pudo renovar, se cierra la sesión.
  useEffect(() => {
    window.addEventListener("kickstamp:unauthorized", cerrarSesionLocal);
    return () => window.removeEventListener("kickstamp:unauthorized", cerrarSesionLocal);
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
        cerrarSesionLocal();
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [session]);

  return { session, isLoading, login, loginConGoogle, logout, actualizarUsuarioActual, actualizarFotoActual };
}
