import { isBrowser, isPlainObject } from "@/lib/storage";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000/api/v1";

const TOKENS_KEY = "kickstamp_tokens";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/** Error del backend con el mensaje listo para mostrar al usuario. */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function getTokens(): Tokens | null {
  if (!isBrowser()) return null;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(TOKENS_KEY) ?? "null");
    if (
      isPlainObject(parsed) &&
      typeof parsed.accessToken === "string" &&
      typeof parsed.refreshToken === "string"
    ) {
      return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken };
    }
  } catch {
    // Tokens corruptos: se tratan como sesión cerrada.
  }
  return null;
}

export function saveTokens(tokens: Tokens) {
  if (isBrowser()) localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
  if (isBrowser()) localStorage.removeItem(TOKENS_KEY);
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** false para endpoints públicos (login, registro, recuperar contraseña). */
  auth?: boolean;
}

let refreshEnCurso: Promise<boolean> | null = null;

async function refrescarTokens(): Promise<boolean> {
  const tokens = getTokens();
  if (!tokens) return false;

  refreshEnCurso ??= fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) return false;
      const { data } = await res.json();
      saveTokens(data);
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshEnCurso = null;
    });

  return refreshEnCurso;
}

function mensajeDeError(payload: unknown, status: number): { message: string; code?: string } {
  if (isPlainObject(payload) && isPlainObject(payload.error)) {
    const { message, code, details } = payload.error;
    // Errores de validación ({ campo: [mensajes] }): el primer mensaje es más claro que "Datos inválidos".
    if (isPlainObject(details)) {
      const primero = Object.values(details).flat().find((item) => typeof item === "string");
      if (typeof primero === "string") {
        return { message: primero, code: typeof code === "string" ? code : undefined };
      }
    }
    if (typeof message === "string") {
      return { message, code: typeof code === "string" ? code : undefined };
    }
  }
  if (status === 0) return { message: "No se pudo conectar con el servidor." };
  return { message: "Ocurrió un error inesperado. Intenta nuevamente." };
}

/**
 * Llama al API REST del backend y devuelve el contenido de `data`.
 * Adjunta el token, lo renueva una vez si expiró y traduce los errores a ApiError.
 */
export async function api<T>(path: string, options: RequestOptions = {}, reintento = true): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = {};
  const esFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !esFormData) headers["Content-Type"] = "application/json";
  if (auth) {
    const tokens = getTokens();
    if (tokens) headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : esFormData ? (body as FormData) : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, mensajeDeError(null, 0).message);
  }

  if (res.status === 401 && auth && reintento && (await refrescarTokens())) {
    return api<T>(path, options, false);
  }

  if (res.status === 204) return undefined as T;

  const payload: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const { message, code } = mensajeDeError(payload, res.status);
    if (res.status === 401 && auth && isBrowser()) {
      window.dispatchEvent(new Event("kickstamp:unauthorized"));
    }
    throw new ApiError(res.status, message, code);
  }

  return (isPlainObject(payload) ? payload.data : payload) as T;
}

export function mensajeError(error: unknown, fallback = "Ocurrió un error inesperado."): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
