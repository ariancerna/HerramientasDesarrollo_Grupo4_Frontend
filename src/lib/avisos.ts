/**
 * Avisos de notificaciones nuevas: un sonido breve generado con Web Audio
 * (no requiere archivos) y una notificación del sistema a través del
 * service worker cuando la aplicación está en segundo plano.
 */

let contextoAudio: AudioContext | null = null;

export function reproducirSonidoNotificacion() {
  try {
    contextoAudio ??= new AudioContext();
    const ctx = contextoAudio;
    if (ctx.state === "suspended") void ctx.resume();

    // Dos notas ascendentes cortas (do–sol), volumen moderado.
    [523.25, 783.99].forEach((frecuencia, indice) => {
      const inicio = ctx.currentTime + indice * 0.14;
      const oscilador = ctx.createOscillator();
      const ganancia = ctx.createGain();
      oscilador.type = "sine";
      oscilador.frequency.value = frecuencia;
      ganancia.gain.setValueAtTime(0.0001, inicio);
      ganancia.gain.exponentialRampToValueAtTime(0.18, inicio + 0.02);
      ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.35);
      oscilador.connect(ganancia).connect(ctx.destination);
      oscilador.start(inicio);
      oscilador.stop(inicio + 0.4);
    });
  } catch {
    // Algunos navegadores bloquean el audio hasta que el usuario interactúa.
  }
}

export function permisoNotificaciones(): NotificationPermission | "no-soportado" {
  if (typeof window === "undefined" || !("Notification" in window)) return "no-soportado";
  return Notification.permission;
}

export async function solicitarPermisoNotificaciones(): Promise<NotificationPermission | "no-soportado"> {
  if (permisoNotificaciones() === "no-soportado") return "no-soportado";
  return Notification.requestPermission();
}

/** Muestra una notificación del sistema si el usuario dio permiso. */
export async function mostrarNotificacionSistema(titulo: string, cuerpo: string, url = "/") {
  if (permisoNotificaciones() !== "granted") return;
  const opciones: NotificationOptions = {
    body: cuerpo,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url },
  };
  try {
    const registro = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (registro) {
      await registro.showNotification(titulo, opciones);
    } else {
      new Notification(titulo, opciones);
    }
  } catch {
    // Si el navegador no permite mostrarla, el aviso dentro de la app es suficiente.
  }
}
