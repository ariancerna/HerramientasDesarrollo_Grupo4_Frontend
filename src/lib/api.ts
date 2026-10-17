import { getSession } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_API_URL. Revisa tu .env.local o las variables de entorno de Vercel.",
    );
  }

  const { body, skipAuth, headers: headersInit, ...rest } = options;

  const headers = new Headers(headersInit);
  headers.set("Content-Type", "application/json");

  if (!skipAuth) {
    const session = getSession();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const rawText = await response.text();
  const parsed: unknown = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    const errorBody = parsed as ApiErrorBody | null;
    const message = errorBody?.error?.message ?? "Ocurrió un error inesperado. Intenta de nuevo.";
    throw new ApiError(response.status, message, errorBody?.error?.code, errorBody?.error?.details);
  }

  const envelope = parsed as { data?: T } | null;
  return envelope?.data as T;
}
