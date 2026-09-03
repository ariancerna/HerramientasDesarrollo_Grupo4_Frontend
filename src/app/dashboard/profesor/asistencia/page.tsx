"use client";

import { FormEvent, useState } from "react";
import Pdf417Scanner from "@/components/scanner/pdf417-scanner";
import {
  EstudianteAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
  registrarAsistencia,
} from "@/store/asistencia-store";

type Vista = "ESCANEO" | "MANUAL";

const ESTUDIANTES_DEMO: EstudianteAsistencia[] = [
  {
    id: "alu-001",
    dni: "76543210",
    nombres: "Valentina",
    apellidos: "Rojas Pérez",
    categoria: "Sub-17 femenino",
    activo: true,
  },
  {
    id: "alu-002",
    dni: "71234567",
    nombres: "Diego",
    apellidos: "Mendoza Ruiz",
    categoria: "Sub-19 masculino",
    activo: true,
  },
  {
    id: "alu-003",
    dni: "70456789",
    nombres: "Camila",
    apellidos: "Torres Silva",
    categoria: "Mayores femenino",
    activo: true,
  },
];

function extraerDni(rawValue: string) {
  const exactValue = rawValue.trim();
  if (/^\d{8}$/.test(exactValue)) return exactValue;

  const separatedValue = exactValue.match(/(?:^|\D)(\d{8})(?:\D|$)/);
  return separatedValue?.[1] ?? null;
}

function formatoFechaInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatoHoraInput(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

export default function AsistenciaProfesorPage() {
  const [vista, setVista] = useState<Vista>("ESCANEO");
  const [estudianteEscaneado, setEstudianteEscaneado] =
    useState<EstudianteAsistencia | null>(null);
  const [dniManual, setDniManual] = useState("");
  const [fechaManual, setFechaManual] = useState(() =>
    formatoFechaInput(new Date()),
  );
  const [horaManual, setHoraManual] = useState(() =>
    formatoHoraInput(new Date()),
  );
  const [mensajeError, setMensajeError] = useState("");
  const [ultimoRegistro, setUltimoRegistro] =
    useState<RegistroAsistencia | null>(null);

  const limpiarMensajes = () => {
    setMensajeError("");
    setUltimoRegistro(null);
  };

  const buscarEstudiante = (dni: string) =>
    ESTUDIANTES_DEMO.find((estudiante) => estudiante.dni === dni);

  const procesarLectura = (rawValue: string) => {
    limpiarMensajes();
    const dni = extraerDni(rawValue);

    if (!dni) {
      setEstudianteEscaneado(null);
      setMensajeError("No se encontró un DNI válido de 8 dígitos en la lectura.");
      return;
    }

    const estudiante = buscarEstudiante(dni);
    if (!estudiante) {
      setEstudianteEscaneado(null);
      setMensajeError(`No existe un estudiante registrado con el DNI ${dni}.`);
      return;
    }

    if (!estudiante.activo) {
      setEstudianteEscaneado(null);
      setMensajeError("El estudiante encontrado no está activo.");
      return;
    }

    setEstudianteEscaneado(estudiante);
  };

  const guardarRegistro = (
    estudiante: EstudianteAsistencia,
    metodo: MetodoAsistencia,
    fechaHora?: string,
  ) => {
    limpiarMensajes();

    try {
      const registro = registrarAsistencia(estudiante, metodo, fechaHora);
      setUltimoRegistro(registro);
      setEstudianteEscaneado(null);
      setDniManual("");
    } catch (error) {
      setMensajeError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la asistencia.",
      );
    }
  };

  const registrarManual = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    limpiarMensajes();

    if (!/^\d{8}$/.test(dniManual)) {
      setMensajeError("El DNI debe contener exactamente 8 dígitos.");
      return;
    }

    const estudiante = buscarEstudiante(dniManual);
    if (!estudiante) {
      setMensajeError(
        `No existe un estudiante registrado con el DNI ${dniManual}.`,
      );
      return;
    }

    if (!fechaManual || !horaManual) {
      setMensajeError("Selecciona la fecha y la hora de asistencia.");
      return;
    }

    const fechaHora = new Date(`${fechaManual}T${horaManual}:00`);
    if (Number.isNaN(fechaHora.getTime())) {
      setMensajeError("La fecha u hora seleccionada no es válida.");
      return;
    }

    guardarRegistro(estudiante, "MANUAL", fechaHora.toISOString());
  };

  const cambiarVista = (nextView: Vista) => {
    setVista(nextView);
    setEstudianteEscaneado(null);
    limpiarMensajes();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          KickStamp · Profesor
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Registro de asistencia
        </h1>
        <p className="mt-1.5 text-sm text-body sm:text-base">
          Escanea el DNI o registra la asistencia manualmente.
        </p>
      </div>

      <div
        className="mb-5 grid grid-cols-2 rounded-xl bg-bg-subtle p-1"
        role="tablist"
        aria-label="Método de registro"
      >
        <button
          type="button"
          role="tab"
          aria-selected={vista === "ESCANEO"}
          onClick={() => cambiarVista("ESCANEO")}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            vista === "ESCANEO"
              ? "bg-surface text-primary-dark shadow-sm"
              : "text-body hover:text-ink"
          }`}
        >
          Escanear DNI
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vista === "MANUAL"}
          onClick={() => cambiarVista("MANUAL")}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            vista === "MANUAL"
              ? "bg-surface text-primary-dark shadow-sm"
              : "text-body hover:text-ink"
          }`}
        >
          Registro manual
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
        {vista === "ESCANEO" ? (
          <Pdf417Scanner
            onDetected={procesarLectura}
            onError={(message) => {
              setMensajeError(message);
              setUltimoRegistro(null);
            }}
          />
        ) : (
          <section aria-labelledby="manual-title">
            <h2 id="manual-title" className="text-lg font-semibold text-ink">
              Registro manual
            </h2>
            <p className="mt-1 text-sm text-body">
              Completa los datos cuando no sea posible leer el DNI con la cámara.
            </p>

            <form onSubmit={registrarManual} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-body">
                  DNI del estudiante
                </span>
                <input
                  value={dniManual}
                  onChange={(event) =>
                    setDniManual(event.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="8 dígitos"
                  required
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-body">
                  Fecha
                </span>
                <input
                  type="date"
                  value={fechaManual}
                  onChange={(event) => setFechaManual(event.target.value)}
                  required
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-body">
                  Hora
                </span>
                <input
                  type="time"
                  value={horaManual}
                  onChange={(event) => setHoraManual(event.target.value)}
                  required
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
                >
                  Registrar asistencia manual
                </button>
              </div>
            </form>
          </section>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">
        Datos de prueba disponibles: 76543210, 71234567 y 70456789.
      </p>

      {estudianteEscaneado && (
        <section className="mt-5 rounded-2xl border border-primary/25 bg-primary-soft p-5">
          <p className="text-sm font-semibold text-primary-dark">
            Estudiante identificado
          </p>
          <h2 className="mt-1 text-xl font-bold text-ink">
            {estudianteEscaneado.nombres} {estudianteEscaneado.apellidos}
          </h2>
          <dl className="mt-3 grid gap-2 text-sm text-body sm:grid-cols-2">
            <div>
              <dt className="font-medium text-muted">DNI</dt>
              <dd>{estudianteEscaneado.dni}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted">Categoría</dt>
              <dd>{estudianteEscaneado.categoria}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => guardarRegistro(estudianteEscaneado, "ESCANEO")}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              Registrar asistencia
            </button>
            <button
              type="button"
              onClick={() => setEstudianteEscaneado(null)}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-body transition hover:bg-bg-subtle"
            >
              Cancelar
            </button>
          </div>
        </section>
      )}

      {mensajeError && (
        <div
          className="mt-5 rounded-xl border border-danger/25 bg-danger-light p-4 text-sm font-medium text-danger"
          role="alert"
        >
          {mensajeError}
        </div>
      )}

      {ultimoRegistro && (
        <div
          className="mt-5 rounded-xl border border-primary/25 bg-primary-soft p-4"
          role="status"
        >
          <p className="font-semibold text-primary-dark">
            Asistencia registrada correctamente
          </p>
          <p className="mt-1 text-sm text-body">
            {ultimoRegistro.estudiante} · {ultimoRegistro.dni} ·{" "}
            {new Intl.DateTimeFormat("es-PE", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(ultimoRegistro.fechaHora))}
          </p>
        </div>
      )}
    </div>
  );
}