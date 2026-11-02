interface ErrorBannerProps {
  mensaje: string | null;
  onCerrar?: () => void;
}

/** Muestra el error devuelto por el backend en una página del dashboard. */
export function ErrorBanner({ mensaje, onCerrar }: ErrorBannerProps) {
  if (!mensaje) return null;

  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
    >
      <p className="font-medium">{mensaje}</p>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          className="shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-200"
          aria-label="Cerrar mensaje de error"
        >
          ×
        </button>
      )}
    </div>
  );
}
