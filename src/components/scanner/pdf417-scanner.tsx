"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type BarcodeFormat = "pdf417" | "qr_code";

/** QR de ingreso generado en el perfil del alumno y PDF417 del reverso del DNI. */
const FORMATOS_DESEADOS: BarcodeFormat[] = ["qr_code", "pdf417"];
/** Pausa entre lecturas: suficiente para que se sienta inmediato sin saturar el equipo. */
const INTERVALO_LECTURA_MS = 120;
const ANCHO_MAXIMO_LECTURA = 1280;

type Detector = {
  detect: (source: ImageBitmapSource) => Promise<{ rawValue: string }[]>;
};

type BarcodeDetectorConstructor = {
  new (options: { formats: BarcodeFormat[] }): Detector;
  getSupportedFormats?: () => Promise<string[]>;
};

interface Pdf417ScannerProps {
  onDetected: (rawValue: string) => void;
  onError?: (message: string) => void;
}

/**
 * Usa el lector nativo del navegador cuando existe y lee QR y PDF417 (Chrome en
 * Android o macOS). En el resto (Chrome/Edge en Windows, Firefox, Safari...) usa
 * el lector zxing en WebAssembly, que funciona en cualquier navegador moderno.
 */
async function crearDetector(): Promise<Detector> {
  const Nativo = (window as typeof window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
  if (Nativo) {
    try {
      const soportados = (await Nativo.getSupportedFormats?.()) ?? [];
      if (FORMATOS_DESEADOS.every((formato) => soportados.includes(formato))) {
        return new Nativo({ formats: FORMATOS_DESEADOS });
      }
    } catch {
      // Se usa el lector en WebAssembly.
    }
  }

  const { BarcodeDetector, prepareZXingModule } = await import("barcode-detector/ponyfill");
  try {
    // El .wasm se sirve desde el propio sitio (lo copia scripts/copiar-zxing-wasm.mjs).
    await prepareZXingModule({
      overrides: {
        locateFile: (ruta: string, prefijo: string) => (ruta.endsWith(".wasm") ? "/zxing/zxing_reader.wasm" : prefijo + ruta),
      },
      fireImmediately: true,
    });
  } catch {
    // Respaldo: CDN de jsDelivr (valor por defecto de la librería).
    await prepareZXingModule({ overrides: {}, fireImmediately: true });
  }
  return new BarcodeDetector({ formats: FORMATOS_DESEADOS });
}

function mensajeErrorCamara(error: unknown) {
  const nombre = error instanceof DOMException ? error.name : "";
  if (nombre === "NotAllowedError" || nombre === "SecurityError") {
    return "No se dio permiso para usar la cámara. Haz clic en el candado de la barra de direcciones, permite la cámara y vuelve a intentarlo.";
  }
  if (nombre === "NotFoundError" || nombre === "OverconstrainedError") {
    return "No se encontró ninguna cámara conectada a este equipo.";
  }
  if (nombre === "NotReadableError" || nombre === "AbortError") {
    return "La cámara está siendo usada por otra aplicación (Zoom, Meet, otra pestaña…). Ciérrala y vuelve a intentarlo.";
  }
  return error instanceof Error && error.message ? error.message : "No fue posible iniciar el escáner.";
}

export default function Pdf417Scanner({
  onDetected,
  onError,
}: Pdf417ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const temporizadorRef = useRef<number | null>(null);
  const detectorRef = useRef<Promise<Detector> | null>(null);
  const activeRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  const [espejo, setEspejo] = useState(false);
  const [message, setMessage] = useState(
    "Activa la cámara y coloca el QR de ingreso del alumno (o el código PDF417 de su DNI) dentro del recuadro.",
  );
  const [testValue, setTestValue] = useState("");

  const reportError = useCallback(
    (errorMessage: string) => {
      setMessage(errorMessage);
      onError?.(errorMessage);
    },
    [onError],
  );

  const stopCamera = useCallback(() => {
    activeRef.current = false;

    if (temporizadorRef.current !== null) {
      window.clearTimeout(temporizadorRef.current);
      temporizadorRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    stopCamera();
    setIniciando(true);
    setMessage("Solicitando permiso para usar la cámara…");

    try {
      if (!window.isSecureContext) {
        throw new Error("La cámara solo funciona en páginas seguras (https o localhost).");
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Este navegador no permite acceder a la cámara. Actualízalo o usa el registro manual.");
      }

      // El lector se prepara mientras el usuario da permiso a la cámara.
      detectorRef.current ??= crearDetector();
      detectorRef.current.catch(() => {
        detectorRef.current = null;
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("No se pudo iniciar la vista de la cámara.");
      }

      // La cámara frontal o la webcam de una PC se muestran como espejo, que es lo natural.
      const ajustes = stream.getVideoTracks()[0]?.getSettings();
      setEspejo(ajustes?.facingMode !== "environment");

      video.srcObject = stream;
      await video.play();
      activeRef.current = true;
      setIsScanning(true);
      setMessage("Preparando el lector de códigos…");

      let detector: Detector;
      try {
        detector = await detectorRef.current;
      } catch {
        throw new Error("No se pudo cargar el lector de códigos. Revisa tu conexión o registra la asistencia de forma manual.");
      }
      if (!activeRef.current) return;
      setMessage("Buscando el código QR o PDF417…");

      const scanFrame = async () => {
        if (!activeRef.current) return;

        const canvas = canvasRef.current;
        if (canvas && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0) {
          const escala = Math.min(1, ANCHO_MAXIMO_LECTURA / video.videoWidth);
          canvas.width = Math.round(video.videoWidth * escala);
          canvas.height = Math.round(video.videoHeight * escala);
          const context = canvas.getContext("2d", { willReadFrequently: true });

          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            try {
              const results = await detector.detect(canvas);
              const value = results.find((result) => result.rawValue)?.rawValue;

              if (value && activeRef.current) {
                stopCamera();
                setMessage("Código detectado correctamente.");
                onDetected(value);
                return;
              }
            } catch {
              // Un cuadro que no se pudo procesar no detiene el escaneo.
            }
          }
        }

        if (activeRef.current) temporizadorRef.current = window.setTimeout(scanFrame, INTERVALO_LECTURA_MS);
      };

      void scanFrame();
    } catch (error) {
      stopCamera();
      reportError(mensajeErrorCamara(error));
    } finally {
      setIniciando(false);
    }
  };

  const submitTestValue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = testValue.trim();

    if (!value) {
      reportError("Ingresa un DNI o el contenido de un código para probar.");
      return;
    }

    stopCamera();
    onDetected(value);
    setTestValue("");
  };

  return (
    <section className="space-y-4" aria-labelledby="scanner-title">
      <div>
        <h2 id="scanner-title" className="text-lg font-semibold text-slate-900 dark:text-white">
          Escanear código de ingreso
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Lee el QR de ingreso del alumno o el código PDF417 del reverso de su DNI.
        </p>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg bg-navy">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${espejo ? "-scale-x-100" : ""}`}
          muted
          playsInline
          aria-label="Vista de la cámara para escanear el DNI"
        />
        {!isScanning && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-slate-300">
            La vista de la cámara aparecerá aquí.
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-[10%] top-1/2 h-[42%] -translate-y-1/2 rounded-lg border-2 border-dashed border-brand-lime"
          aria-hidden="true"
        />
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <p className="min-h-5 text-sm text-slate-600 dark:text-slate-400" role="status">
        {message}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={isScanning ? stopCamera : startCamera}
          disabled={iniciando}
          className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
        >
          {iniciando ? "Activando cámara…" : isScanning ? "Detener cámara" : "Activar cámara"}
        </button>
      </div>

      <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
          Probar sin cámara
        </summary>
        <form onSubmit={submitTestValue} className="mt-3 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="scanner-test-value">
            DNI de prueba
          </label>
          <input
            id="scanner-test-value"
            value={testValue}
            onChange={(event) => setTestValue(event.target.value)}
            inputMode="numeric"
            placeholder="Ejemplo: 76543210"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-green hover:bg-brand-green-soft dark:border-slate-600 dark:text-slate-200 dark:hover:bg-brand-green/10"
          >
            Simular lectura
          </button>
        </form>
      </details>
    </section>
  );
}