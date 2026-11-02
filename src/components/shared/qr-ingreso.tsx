"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode } from "lucide-react";

/** Contenido del QR: el escáner del profesor extrae el DNI de 8 dígitos. */
export function contenidoQrIngreso(dni: string) {
  return `ELGOLAZO|DNI:${dni}`;
}

interface QrIngresoProps {
  dni: string;
  nombre: string;
  /** Tamaño del QR en píxeles. */
  tamano?: number;
}

/** Código QR de ingreso generado a partir del DNI del alumno. */
export function QrIngreso({ dni, nombre, tamano = 196 }: QrIngresoProps) {
  const [imagen, setImagen] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const dniValido = /^\d{8}$/.test(dni);

  useEffect(() => {
    if (!dniValido) return;
    let vigente = true;
    QRCode.toDataURL(contenidoQrIngreso(dni), {
      width: tamano * 2,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0b1730", light: "#ffffff" },
    })
      .then((url) => vigente && setImagen(url))
      .catch(() => vigente && setError(true));
    return () => {
      vigente = false;
    };
  }, [dni, dniValido, tamano]);

  if (!dniValido || error) {
    return (
      <p className="rounded-lg bg-surface-muted p-4 text-center text-sm text-body">
        No se pudo generar el código QR: el DNI registrado no es válido.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* El QR siempre va sobre fondo blanco para que la cámara lo lea en ambos temas. */}
      <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagen} alt={`Código QR de ingreso de ${nombre}`} width={tamano} height={tamano} />
        ) : (
          <div className="grid animate-pulse place-items-center bg-slate-100" style={{ width: tamano, height: tamano }}>
            <QrCode className="h-10 w-10 text-slate-300" />
          </div>
        )}
      </div>
      <p className="num text-xs text-muted">DNI {dni}</p>
      {imagen && (
        <a
          href={imagen}
          download={`qr-ingreso-${dni}.png`}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          <Download className="h-4 w-4" /> Descargar QR
        </a>
      )}
    </div>
  );
}
