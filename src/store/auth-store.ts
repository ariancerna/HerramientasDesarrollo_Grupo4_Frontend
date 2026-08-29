import { Session, Usuario } from "@/types";

const SESSION_KEY = "kickstamp_session";
const SESSION_CHANGE_EVENT = "kickstamp:session-change";

// Tiempo de inactividad permitido antes de cerrar sesión (US-02)
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos

// Next.js renderiza en servidor primero: localStorage no existe ahí.
// Esta función evita errores de "window is not defined".
function isBrowser() {
  return typeof window !== "undefined";
}

function notifySessionChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
  }
}

export function getSessionSnapshot(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(SESSION_KEY);
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
    return JSON.parse(snapshot) as Session;
  } catch {
    return null;
  }
}

export function saveSession(usuario: Usuario): Session {
  const now = Date.now();
  const session: Session = { usuario, loginTime: now, lastActivity: now };
  if (isBrowser()) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySessionChange();
  }
  return session;
}

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function touchSession(): Session | null {
  const session = getSession();
  if (!session) return null;
  session.lastActivity = Date.now();
  if (isBrowser()) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySessionChange();
  }
  return session;
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
