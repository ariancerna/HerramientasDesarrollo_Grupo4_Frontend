const STORAGE_PREFIX = "kickstamp-notifications-read";
const CHANGE_EVENT = "kickstamp:notifications-change";
const EMPTY_SNAPSHOT = "[]";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getReadNotificationsSnapshot(userId: string) {
  if (!isBrowser() || !userId) return EMPTY_SNAPSHOT;
  return localStorage.getItem(storageKey(userId)) ?? EMPTY_SNAPSHOT;
}

export function getReadNotificationsServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

export function subscribeToReadNotifications(
  userId: string,
  onStoreChange: () => void,
) {
  if (!isBrowser() || !userId) return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey(userId)) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function parseReadNotificationIds(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);
    if (!Array.isArray(value)) return new Set<string>();
    return new Set(value.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set<string>();
  }
}

export function saveReadNotificationIds(userId: string, ids: Iterable<string>) {
  if (!isBrowser() || !userId) return;
  const uniqueIds = [...new Set(ids)];
  localStorage.setItem(storageKey(userId), JSON.stringify(uniqueIds));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
