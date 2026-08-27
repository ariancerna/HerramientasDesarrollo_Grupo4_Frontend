"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Pdf417Scanner from "@/components/scanner/pdf417-scanner";
import AsistenciaTabla from "@/components/shared/asistencia-tabla";
import ConfirmacionEscaneo from "@/components/shared/confirmacion-escaneo";
import { RoleGuard } from "@/components/shared/role-guard";
import {
  EstudianteAsistencia,
  MetodoAsistencia,
  RegistroAsistencia,
  obtenerRegistrosAsistencia,
  registrarAsistencia,
} from "@/store/asistencia-store";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { Student } from "@/types/student";

type Vista = "ESCANEO" | "MANUAL";

interface ConfirmacionPendiente {
  estudiante: EstudianteAsistencia;
  metodo: MetodoAsistencia;
  fechaHora: string;
}

function extraerDni(rawValue: string) {
  const exactValue = rawValue.trim();
  if (/^\d{8}$/.test(exactValue)) return exactValue;

  const separatedValue = exactValue.match(/(?:^|\D)(\d{8})(?:\D|$)/);
  return separatedValue?.[1] ?? null;
}

function fechaLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function horaLocal(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function convertirEstudiante(alumno: Student): EstudianteAsistencia {
  return {
    id: alumno.id,
    dni: alumno.dni,
    nombres: alumno.nombres,
    apellidos: alumno.apellidos,
    categoria: alumno.categoria,
    activo: alumno.estado === "activo",
  };
}

export default function AsistenciaProfesorPage() {
  const ahora = useMemo(() => new Date(), []);
  const [vista, setVista] = useState<Vista>("ESCANEO");
  const [estudianteEscaneado, setEstudianteEscaneado] =
    useState<EstudianteAsistencia | null>(null);
  const [dniManual, setDniManual] = useState("");
  const [fechaManual, setFechaManual] = useState(() => fechaLocal(ahora));
  const [horaManual, setHoraManual] = useState(() => horaLocal(ahora));
  const [alumnosSugeridos, setAlumnosSugeridos] = useState<Student[]>([]);
  const [mensajeError, setMensajeError] = useState("");
  const [ultimoRegistro, setUltimoRegistro] =
    useState<RegistroAsistencia | null>(null);
  const [confirmacionPendiente, setConfirmacionPendiente] =
    useState<ConfirmacionPendiente | null>(null);
  const [registros, setRegistros] = useState<RegistroAsistencia[]>(
    obtenerRegistrosAsistencia,
  );

  const registrosDeHoy = useMemo(() => {
    const hoy = fechaLocal(new Date());
    return registros.filter(
      (registro) => fechaLocal(new Date(registro.fechaHora)) === hoy,
    );
  }, [registros]);

  const resumen = useMemo(
    () => ({
      total: registrosDeHoy.length,
      escaneos: registrosDeHoy.filter((registro) => registro.metodo === "ESCANEO")
        .length,
      manuales: registrosDeHoy.filter((registro) => registro.metodo === "MANUAL")
        .length,
    }),
    [registrosDeHoy],
  );

  const limpiarMensajes = () => {
    setMensajeError("");
    setUltimoRegistro(null);
  };

  const buscarEstudiante = (dni: string): EstudianteAsistencia | undefined => {
    const alumno = obtenerAlumnos().find((item) => item.dni === dni);
    return alumno ? convertirEstudiante(alumno) : undefined;
  };

  const validarEstudiante = (dni: string) => {
    const estudiante = buscarEstudiante(dni);

    if (!estudiante) {
      setMensajeError(`No existe un estudiante registrado con el DNI ${dni}.`);
      return null;
    }

    if (!estudiante.activo) {
      setMensajeError("El estudiante encontrado está inactivo.");
      return null;
    }

    return estudiante;
  };

  const procesarLectura = (rawValue: string) => {
    limpiarMensajes();
    setConfirmacionPendiente(null);
    const dni = extraerDni(rawValue);

    if (!dni) {
      setEstudianteEscaneado(null);
      setMensajeError("No se encontró un DNI válido de 8 dígitos en la lectura.");
      return;
    }

    const estudiante = validarEstudiante(dni);
    setEstudianteEscaneado(estudiante);
  };

  const guardarRegistro = (
    estudiante: EstudianteAsistencia,
    metodo: MetodoAsistencia,
    fechaHora: string,
  ) => {
    limpiarMensajes();

    try {
      const registro = registrarAsistencia(estudiante, metodo, fechaHora);
      setRegistros(obtenerRegistrosAsistencia());
      setUltimoRegistro(registro);
      setEstudianteEscaneado(null);
      setDniManual("");
      setConfirmacionPendiente(null);
    } catch (error) {
      setConfirmacionPendiente(null);
      setMensajeError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la asistencia.",
      );
    }
  };

  const solicitarConfirmacion = (
    estudiante: EstudianteAsistencia,
    metodo: MetodoAsistencia,
    fechaHora = new Date().toISOString(),
  ) => {
    limpiarMensajes();
    setEstudianteEscaneado(null);
    setConfirmacionPendiente({ estudiante, metodo, fechaHora });
  };

  const registrarManual = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    limpiarMensajes();

    if (!/^\d{8}$/.test(dniManual)) {
      setMensajeError("El DNI debe contener exactamente 8 dígitos.");
      return;
    }

    const estudiante = validarEstudiante(dniManual);
    if (!estudiante) return;

    if (!fechaManual || !horaManual) {
      setMensajeError("Selecciona la fecha y la hora de asistencia.");
      return;
    }

    const fechaHora = new Date(`${fechaManual}T${horaManual}:00`);
    if (Number.isNaN(fechaHora.getTime())) {
      setMensajeError("La fecha u hora seleccionada no es válida.");
      return;
    }

    if (fechaHora.getTime() > Date.now() + 60_000) {
      setMensajeError("No se puede registrar una asistencia en el futuro.");
      return;
    }

    solicitarConfirmacion(estudiante, "MANUAL", fechaHora.toISOString());
  };

  const cambiarVista = (nextView: Vista) => {
    setVista(nextView);
    setEstudianteEscaneado(null);
    setConfirmacionPendiente(null);
    limpiarMensajes();
  };

  const cargarSugerencias = () => {
    setAlumnosSugeridos(
      obtenerAlumnos().filter((alumno) => alumno.estado === "activo"),
    );
  };

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                KickStamp · Profesor
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Registro de asistencia
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Identifica al estudiante y confirma su ingreso al entrenamiento.
              </p>
            </div>
            <Link
              href="/dashboard/profesor"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Volver al panel
            </Link>
          </header>

          <section className="mb-6 grid gap-3 sm:grid-cols-3" aria-label="Resumen del día">
            {[
              { etiqueta: "Asistencias de hoy", valor: resumen.total, tono: "text-slate-950" },
              { etiqueta: "Por escaneo", valor: resumen.escaneos, tono: "text-emerald-700" },
              { etiqueta: "Registro manual", valor: resumen.manuales, tono: "text-amber-700" },
            ].map((item) => (
              <article
                key={item.etiqueta}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">{item.etiqueta}</p>
                <p className={`mt-1 text-3xl font-bold ${item.tono}`}>{item.valor}</p>
              </article>
            ))}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-100 p-1" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={vista === "ESCANEO"}
                onClick={() => cambiarVista("ESCANEO")}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  vista === "ESCANEO"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Escanear DNI
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={vista === "MANUAL"}
                onClick={() => cambiarVista("MANUAL")}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  vista === "MANUAL"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Registro manual
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {confirmacionPendiente ? (
                <ConfirmacionEscaneo
                  estudiante={confirmacionPendiente.estudiante}
                  metodo={confirmacionPendiente.metodo}
                  fechaHora={confirmacionPendiente.fechaHora}
                  onConfirmar={() =>
                    guardarRegistro(
                      confirmacionPendiente.estudiante,
                      confirmacionPendiente.metodo,
                      confirmacionPendiente.fechaHora,
                    )
                  }
                  onCancelar={() => setConfirmacionPendiente(null)}
                />
              ) : vista === "ESCANEO" ? (
                <Pdf417Scanner
                  onDetected={procesarLectura}
                  onError={(message) => {
                    setMensajeError(message);
                    setUltimoRegistro(null);
                  }}
                />
              ) : (
                <section aria-labelledby="manual-title">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 id="manual-title" className="text-lg font-semibold text-slate-900">
                        Registro manual
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Úsalo cuando el DNI esté deteriorado o la cámara no esté disponible.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={registrarManual} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        DNI del estudiante
                      </span>
                      <input
                        list="alumnos-activos"
                        value={dniManual}
                        onFocus={cargarSugerencias}
                        onChange={(event) =>
                          setDniManual(event.target.value.replace(/\D/g, "").slice(0, 8))
                        }
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Ingresa o selecciona un DNI"
                        required
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      />
                      <datalist id="alumnos-activos">
                        {alumnosSugeridos.map((alumno) => (
                          <option key={alumno.id} value={alumno.dni}>
                            {alumno.nombres} {alumno.apellidos} · {alumno.categoria}
                          </option>
                        ))}
                      </datalist>
                      <p className="mt-1.5 text-xs text-slate-500">
                        Al enfocar el campo podrás elegir entre los alumnos activos.
                      </p>
                    </label>

                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Fecha</span>
                      <input
                        type="date"
                        value={fechaManual}
                        max={fechaLocal(new Date())}
                        onChange={(event) => setFechaManual(event.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      />
                    </label>

                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Hora</span>
                      <input
                        type="time"
                        value={horaManual}
                        onChange={(event) => setHoraManual(event.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      />
                    </label>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                      >
                        Revisar y confirmar asistencia
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </div>
          </section>

          {estudianteEscaneado && (
            <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5" role="status">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">DNI leído correctamente</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    {estudianteEscaneado.nombres} {estudianteEscaneado.apellidos}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {estudianteEscaneado.dni} · {estudianteEscaneado.categoria}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  Alumno activo
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => solicitarConfirmacion(estudianteEscaneado, "ESCANEO")}
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Continuar al registro
                </button>
                <button
                  type="button"
                  onClick={() => setEstudianteEscaneado(null)}
                  className="rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100"
                >
                  Cancelar
                </button>
              </div>
            </section>
          )}

          {mensajeError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">
              {mensajeError}
            </div>
          )}

          {ultimoRegistro && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4" role="status">
              <div>
                <p className="font-semibold text-emerald-900">Asistencia registrada correctamente</p>
                <p className="mt-1 text-sm text-emerald-800">
                  {ultimoRegistro.estudiante} · {ultimoRegistro.dni} ·{" "}
                  {new Intl.DateTimeFormat("es-PE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(ultimoRegistro.fechaHora))}
                </p>
              </div>
            </div>
          )}

          <section className="mt-8" aria-labelledby="registros-hoy-title">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 id="registros-hoy-title" className="text-lg font-bold text-slate-950">
                  Registros de hoy
                </h2>
                <p className="text-sm text-slate-500">Últimas asistencias guardadas en este navegador.</p>
              </div>
              <span className="text-sm font-medium text-slate-500">
                {registrosDeHoy.length} registro(s)
              </span>
            </div>
            <AsistenciaTabla registros={registrosDeHoy.slice(0, 5)} />
          </section>
        </div>
      </main>
    </RoleGuard>
  );
}
