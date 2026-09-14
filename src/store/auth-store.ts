import { Session, Usuario } from "@/types";
import {
  decodeData,
  encodeData,
  isBrowser,
  isFiniteNumber,
  isPlainObject,
} from "@/lib/storage";
import { isUsuario } from "@/lib/storage-validators";

const SESSION_KEY = "kickstamp_session";
const SESSION_CHANGE_EVENT = "kickstamp:session-change";

export const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

function notifySessionChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
  }
}

function isValidSession(obj: unknown): obj is Session {
  if (!isPlainObject(obj)) return false;
  if (!isUsuario(obj.usuario)) return false;
  if (!isFiniteNumber(obj.loginTime) || !isFiniteNumber(obj.lastActivity)) return false;

  const now = Date.now();
  if (obj.loginTime > now + 60_000 || obj.lastActivity > now + 60_000) return false;
  if (obj.lastActivity < obj.loginTime) return false;

  return true;
}

function encodeSession(session: Session): string {
  return encodeData(JSON.stringify(session));
}

export function getSessionSnapshot(): string | null {
  if (!isBrowser()) return null;

  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function subscribeToSession(onStoreChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(SESSION_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SESSION_CHANGE_EVENT, onStoreChange);
  };
}

export function parseSessionSnapshot(snapshot: string | null): Session | null {
  if (!snapshot) return null;

  try {
    const decoded = decodeData(snapshot);
    if (!decoded) return null;

    const parsed: unknown = JSON.parse(decoded);
    return isValidSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(usuario: Usuario): Session {
  const now = Date.now();
  const session: Session = { usuario, loginTime: now, lastActivity: now };
  if (isBrowser()) {
    localStorage.setItem(SESSION_KEY, encodeSession(session));
    notifySessionChange();
  }
  return session;
}

export function getSession(): Session | null {
  const session = parseSessionSnapshot(getSessionSnapshot());

  if (!session && isBrowser()) {
    localStorage.removeItem(SESSION_KEY);
  }

  return session;
}

export function touchSession(): Session | null {
  const session = getSession();
  if (!session) return null;

  const updated: Session = { ...session, lastActivity: Date.now() };
  if (isBrowser()) {
    localStorage.setItem(SESSION_KEY, encodeSession(updated));
    notifySessionChange();
  }
  return updated;
}

export function actualizarUsuarioSesion(
  cambios: Partial<Pick<Usuario, "nombre">>,
): Session | null {
  const session = getSession();
  if (!session) return null;

  const nombre = cambios.nombre?.trim();
  const actualizada: Session = {
    ...session,
    usuario: {
      ...session.usuario,
      ...(nombre ? { nombre } : {}),
    },
    lastActivity: Date.now(),
  };

  if (isBrowser()) {
    localStorage.setItem(SESSION_KEY, encodeSession(actualizada));
    notifySessionChange();
  }

  return actualizada;
}

export function clearSession(): void {
  if (isBrowser()) {
    localStorage.removeItem(SESSION_KEY);
    notifySessionChange();
  }
}

export function isSessionExpired(session: Session | null): boolean {
  if (!session) return true;
  return Date.now() - session.lastActivity > SESSION_TIMEOUT_MS;
}
