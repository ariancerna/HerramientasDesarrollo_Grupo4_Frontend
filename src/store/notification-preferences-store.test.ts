import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getReadNotificationsSnapshot,
  parseReadNotificationIds,
  saveReadNotificationIds,
  subscribeToReadNotifications,
} from "@/store/notification-preferences-store";

describe("preferencias de notificaciones", () => {
  beforeEach(() => localStorage.clear());

  it("separa las notificaciones leídas por usuario", () => {
    saveReadNotificationIds("usuario-1", ["n1", "n1", "n2"]);

    expect(
      [...parseReadNotificationIds(getReadNotificationsSnapshot("usuario-1"))],
    ).toEqual(["n1", "n2"]);
    expect(getReadNotificationsSnapshot("usuario-2")).toBe("[]");
  });

  it("notifica cambios realizados en la misma pestaña", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToReadNotifications("usuario-1", listener);

    saveReadNotificationIds("usuario-1", ["n1"]);

    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });
});
