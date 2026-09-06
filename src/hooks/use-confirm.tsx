"use client";

import { useCallback, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ConfirmOptions {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  hideCancel?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

/**
 * Reemplaza window.confirm/alert por un modal consistente.
 * Uso: const { confirm, dialog } = useConfirm();
 *      const ok = await confirm({ title, message, variant: "danger" });
 *      // ...renderizar {dialog} en el árbol del componente
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  const close = (result: boolean) => {
    setState((current) => {
      current?.resolve(result);
      return null;
    });
  };

  const dialog = (
    <ConfirmDialog
      open={state !== null}
      title={state?.title ?? ""}
      message={state?.message ?? ""}
      confirmLabel={state?.confirmLabel}
      cancelLabel={state?.cancelLabel}
      variant={state?.variant}
      hideCancel={state?.hideCancel}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { confirm, dialog };
}
