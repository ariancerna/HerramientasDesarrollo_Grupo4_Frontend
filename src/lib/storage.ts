export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Ofuscación simple para LocalStorage (Base64)
export function encodeData(data: string): string {
  if (!isBrowser()) return data;
  return btoa(encodeURIComponent(data));
}

export function decodeData(data: string): string {
  if (!isBrowser()) return data;
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return "";
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function writeJson(key: string, value: unknown): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}

export function readJson<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
): T {
  if (!isBrowser()) return fallback;

  const raw = localStorage.getItem(key);
  if (!raw) {
    writeJson(key, fallback);
    return fallback;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isValid(parsed)) return parsed;
  } catch {
    // Restaurar abajo mantiene la app usable aunque el storage este corrupto.
  }

  writeJson(key, fallback);
  return fallback;
}

export function readJsonList<T>(
  key: string,
  fallback: T[],
  isValidItem: (value: unknown) => value is T,
): T[] {
  return readJson(key, fallback, (value): value is T[] =>
    Array.isArray(value) && value.every(isValidItem),
  );
}

/**
 * Guarda datos en LocalStorage de forma segura y ofuscada.
 */
export function safeSetItem(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    const encodedValue = encodeData(stringValue);
    localStorage.setItem(key, encodedValue);
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}

/**
 * Recupera datos ofuscados del LocalStorage.
 * Retorna null si la llave no existe o si los datos están corruptos.
 */
export function safeGetItem<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const decoded = decodeData(raw);
    if (!decoded) {
      localStorage.removeItem(key);
      return null;
    }

    return JSON.parse(decoded) as T;
  } catch {
    console.warn(`Data for key "${key}" is corrupted. Removing it.`);
    localStorage.removeItem(key);
    return null;
  }
}
