"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type BarcodeFormat = "pdf417";

type BarcodeDetectorResult = {
  rawValue: string;
};

type BarcodeDetectorInstance = {
  detect: (source: ImageBitmapSource) => Promise<BarcodeDetectorResult[]>;
};

type BarcodeDetectorConstructor = {
  new (options: { formats: BarcodeFormat[] }): BarcodeDetectorInstance;
  getSupportedFormats?: () => Promise<string[]>;
};

interface Pdf417ScannerProps {
  onDetected: (rawValue: string) => void;
  onError?: (message: string) => void;
}

function getBarcodeDetector() {
  return (
    window as typeof window & {
      BarcodeDetector?: BarcodeDetectorConstructor;
    }
  ).BarcodeDetector;
}

export default function Pdf417Scanner({
  onDetected,
  onError,
}: Pdf417ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState(
    "Activa la cámara y coloca el código PDF417 del DNI dentro del recuadro.",
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

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
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
    setMessage("Solicitando permiso para usar la cámara…");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Este navegador no permite acceder a la cámara.");
      }

      if (!window.isSecureContext) {
        throw new Error(
          "La cámara requiere una conexión segura (HTTPS) o ejecutar la app en localhost.",
        );
      }

      const BarcodeDetectorApi = getBarcodeDetector();
      if (!BarcodeDetectorApi) {
        throw new Error(
          "Este navegador no reconoce PDF417 de forma nativa. Usa Chrome en Android o la prueba sin cámara.",
        );
      }

      const supportedFormats =
        (await BarcodeDetectorApi.getSupportedFormats?.()) ?? [];
      if (supportedFormats.length > 0 && !supportedFormats.includes("pdf417")) {
        throw new Error(
          "La cámara de este dispositivo no admite códigos PDF417. Usa la prueba sin cámara.",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("No se pudo iniciar la vista de la cámara.");
      }

      video.srcObject = stream;
      await video.play();

      const detector = new BarcodeDetectorApi({ formats: ["pdf417"] });
      activeRef.current = true;
      setIsScanning(true);
      setMessage("Buscando el código PDF417 del DNI…");

      const scanFrame = async () => {
        if (!activeRef.current) return;

        const canvas = canvasRef.current;
        if (canvas && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d", { willReadFrequently: true });

          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            let results: BarcodeDetectorResult[];
            try {
              results = await detector.detect(canvas);
            } catch {
              stopCamera();
              reportError(
                "Se interrumpió la lectura del DNI. Intenta activar la cámara nuevamente.",
              );
              return;
            }

            const value = results.find((result) => result.rawValue)?.rawValue;

            if (value) {
              stopCamera();
              setMessage("DNI detectado correctamente.");
              onDetected(value);
              return;
            }
          }
        }

        frameRef.current = requestAnimationFrame(scanFrame);
      };

      frameRef.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      stopCamera();
      reportError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar el escáner.",
      );
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
        <h2 id="scanner-title" className="text-lg font-semibold text-slate-900">
          Escanear DNI
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Lee el código PDF417 que se encuentra en el reverso del documento.
        </p>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
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
          className="pointer-events-none absolute inset-x-[10%] top-1/2 h-[42%] -translate-y-1/2 rounded-xl border-2 border-dashed border-amber-400"
          aria-hidden="true"
        />
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <p className="min-h-5 text-sm text-slate-600" role="status">
        {message}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={isScanning ? stopCamera : startCamera}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isScanning ? "Detener cámara" : "Activar cámara"}
        </button>
      </div>

      <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
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
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
          <button
            type="submit"
            className="rounded-xl border border-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-amber-500 hover:bg-amber-50"
          >
            Simular lectura
          </button>
        </form>
      </details>
    </section>
  );
}
