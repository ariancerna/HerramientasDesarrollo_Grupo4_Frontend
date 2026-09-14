"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
            <h2 className="mb-2 text-2xl font-bold text-slate-800">
              Ups, algo salio mal.
            </h2>
            <p className="mb-6 text-slate-500">
              Detectamos un error inesperado. Si el problema persiste, es posible
              que tus datos locales esten corruptos.
            </p>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("kickstamp_session");
                  window.location.replace(new URL("/auth/login", window.location.origin));
                }
              }}
              className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90"
            >
              Restablecer sesion e ir al Login
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Recargar pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
