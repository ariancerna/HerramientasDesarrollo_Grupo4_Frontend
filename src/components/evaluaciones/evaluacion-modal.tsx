"use client";

interface EvaluacionModalProps {
  titulo: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function EvaluacionModal({
  titulo,
  children,
  onClose,
}: EvaluacionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="evaluacion-modal-title"
        className="my-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="evaluacion-modal-title" className="text-lg font-bold text-slate-950 dark:text-white">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="grid h-8 w-8 place-items-center rounded-lg text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
