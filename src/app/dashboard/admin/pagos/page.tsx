"use client";

import { useDatosRemotos } from "@/lib/remote-collection";
import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { PagosLista } from "@/components/shared/pagos-lista";
import { ErrorBanner } from "@/components/shared/error-banner";
import { mensajeError } from "@/lib/api";
import { Student } from "@/types/student";
import { alumnosCargados, obtenerAlumnos } from "@/store/alumnos-store";
import type { PagoMensualidad } from "@/types/pago";
import {
  obtenerMensualidadActual,
  registrarPagoAlumno,
  marcarPagoPendiente,
  formatearMonto,
  formatearPeriodo,
  pagosCargados,
} from "@/store/pagos-store";

type FiltroPago = "todos" | "pagados" | "pendientes";
const MONTO_MENSUALIDAD = 180;
const METODOS_PAGO: NonNullable<PagoMensualidad["metodoPago"]>[] = [
  "Yape",
  "Plin",
  "Transferencia",
  "Efectivo",
];

function periodoActual() {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
}

export default function PagosAdminPage() {
  const version = useDatosRemotos();
  const alumnos: Student[] = obtenerAlumnos();
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState<FiltroPago>("todos");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [modalAlumno, setModalAlumno] = useState<Student | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<NonNullable<PagoMensualidad["metodoPago"]>>("Yape");
  const [codigoOperacion, setCodigoOperacion] = useState("");

  const periodo = periodoActual();

  const filas = useMemo(() => {
    const termino = texto.trim().toLowerCase();
    return alumnos
      .map((alumno) => ({
        alumno,
        pago: obtenerMensualidadActual(alumno.id) ?? null,
      }))
      .filter(({ alumno, pago }) => {
        const coincideTexto =
          !termino ||
          `${alumno.nombres} ${alumno.apellidos}`.toLowerCase().includes(termino) ||
          alumno.dni.includes(termino) ||
          alumno.codigo.toLowerCase().includes(termino);
        const pagado = pago?.estado === "pagado";
        const coincideFiltro =
          filtro === "todos" ||
          (filtro === "pagados" && pagado) ||
          (filtro === "pendientes" && !pagado);
        return coincideTexto && coincideFiltro;
      });
    // version: los pagos se leen del store, así que se recalcula cuando cambian.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alumnos, texto, filtro, version]);

  const pagados = alumnos.filter((a) => obtenerMensualidadActual(a.id)?.estado === "pagado").length;
  const pendientes = alumnos.length - pagados;

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(null), 3000);
  };

  const abrirModalRegistro = (alumno: Student) => {
    setModalAlumno(alumno);
    setMetodoSeleccionado("Yape");
    setCodigoOperacion("");
  };

  const confirmarRegistroPago = async () => {
    if (!modalAlumno) return;

    setError(null);
    setGuardando(true);
    try {
      await registrarPagoAlumno(modalAlumno.id, periodo, metodoSeleccionado, codigoOperacion);
      mostrarMensaje(`Pago registrado para ${modalAlumno.nombres} ${modalAlumno.apellidos}.`);
      setModalAlumno(null);
    } catch (err) {
      setError(mensajeError(err, "No se pudo registrar el pago."));
    } finally {
      setGuardando(false);
    }
  };

  const marcarComoDeuda = async (pago: PagoMensualidad, alumno: Student) => {
    setError(null);
    try {
      await marcarPagoPendiente(pago.id);
      mostrarMensaje(`Se marcó como pendiente el pago de ${alumno.nombres} ${alumno.apellidos}.`);
    } catch (err) {
      setError(mensajeError(err, "No se pudo actualizar el pago."));
    }
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Pagos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Registra los pagos y consulta las deudas pendientes de los alumnos. Periodo actual:{" "}
            {formatearPeriodo(periodo)}.
          </p>
        </header>

        {mensaje && (
          <div className="mb-5 rounded-lg border border-brand-green/20 bg-brand-green-soft p-4 text-sm text-brand-green dark:border-brand-green/30 dark:bg-brand-green/10 dark:text-brand-lime-light">
            {mensaje}
          </div>
        )}

        <div className="mb-5">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
        </div>

        <dl className="mb-5 grid gap-3 sm:grid-cols-3">
          <Resumen label="Alumnos" valor={alumnos.length} />
          <Resumen label="Pagos al día" valor={pagados} tono="verde" />
          <Resumen label="Por pagar" valor={pendientes} tono="rojo" />
        </dl>

        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre, DNI o código..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as FiltroPago)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:w-48"
          >
            <option value="todos">Todos los estados</option>
            <option value="pagados">Pagos al día</option>
            <option value="pendientes">Por pagar</option>
          </select>
        </div>

        <PagosLista
          cargando={!pagosCargados() || !alumnosCargados()}
          filas={filas}
          montoBase={MONTO_MENSUALIDAD}
          onRegistrar={abrirModalRegistro}
          onMarcarDeuda={marcarComoDeuda}
        />

        {modalAlumno && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Registrar pago</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {modalAlumno.nombres} {modalAlumno.apellidos} · {formatearMonto(MONTO_MENSUALIDAD)} ·{" "}
                {formatearPeriodo(periodo)}
              </p>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Método de pago
                </span>
                <select
                  value={metodoSeleccionado}
                  onChange={(e) => setMetodoSeleccionado(e.target.value as typeof metodoSeleccionado)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  {METODOS_PAGO.map((metodo) => (
                    <option key={metodo} value={metodo}>
                      {metodo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-3 block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Código de operación (opcional)
                </span>
                <input
                  value={codigoOperacion}
                  onChange={(e) => setCodigoOperacion(e.target.value)}
                  placeholder="Ej. YP-840215"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </label>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModalAlumno(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarRegistroPago}
                  disabled={guardando}
                  className="rounded-lg bg-brand-green px-4 py-2 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-60"
                >
                  {guardando ? "Registrando..." : "Confirmar pago"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

function Resumen({ label, valor, tono = "azul" }: { label: string; valor: number; tono?: "azul" | "verde" | "rojo" }) {
  const colores = {
    azul: "border-slate-200 text-slate-950 dark:border-slate-700 dark:text-white",
    verde:
      "border-brand-green/20 text-brand-green dark:border-brand-green/30 dark:text-brand-lime-light",
    rojo: "border-red-200 text-red-700 dark:border-red-500/30 dark:text-red-400",
  };
  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 ${colores[tono]}`}>
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 text-2xl font-bold">{valor}</dd>
    </div>
  );
}