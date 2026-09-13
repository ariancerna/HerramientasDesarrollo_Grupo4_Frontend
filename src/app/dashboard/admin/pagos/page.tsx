"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { Student } from "@/types/student";
import { obtenerAlumnos } from "@/store/alumnos-store";
import type { PagoMensualidad } from "@/types/pago";
import {
  obtenerPagos,
  obtenerPagosIniciales,
  suscribirPagos,
  obtenerMensualidadActual,
  crearPago,
  registrarPagoMensualidad,
  actualizarPago,
  formatearMonto,
  formatearPeriodo,
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
  useSyncExternalStore(suscribirPagos, obtenerPagos, obtenerPagosIniciales);
  const alumnos: Student[] = obtenerAlumnos();
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState<FiltroPago>("todos");
  const [mensaje, setMensaje] = useState<string | null>(null);
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
  }, [alumnos, texto, filtro]);

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

  const confirmarRegistroPago = () => {
    if (!modalAlumno) return;
    const pagoExistente = obtenerMensualidadActual(modalAlumno.id);

    if (pagoExistente && pagoExistente.estado !== "pagado") {
      registrarPagoMensualidad(pagoExistente.id, metodoSeleccionado, codigoOperacion || undefined);
    } else {
      crearPago({
        estudianteId: modalAlumno.id,
        periodo,
        concepto: `Mensualidad de ${formatearPeriodo(periodo)}`,
        monto: MONTO_MENSUALIDAD,
        moneda: "PEN",
        vencimiento: `${periodo}-10`,
        estado: "pagado",
        fechaPago: new Date().toISOString().slice(0, 10),
        metodoPago: metodoSeleccionado,
        codigoOperacion: codigoOperacion || undefined,
      });
    }

    mostrarMensaje(`Pago registrado para ${modalAlumno.nombres} ${modalAlumno.apellidos}.`);
    setModalAlumno(null);
  };

  const marcarComoDeuda = (pago: PagoMensualidad, alumno: Student) => {
    actualizarPago(pago.id, {
      estado: "pendiente",
      fechaPago: undefined,
      metodoPago: undefined,
      codigoOperacion: undefined,
    });
    mostrarMensaje(`Se marcó como pendiente el pago de ${alumno.nombres} ${alumno.apellidos}.`);
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">ADMINISTRACIÓN</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Pagos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Registra los pagos y consulta las deudas pendientes de los alumnos. Periodo actual:{" "}
            {formatearPeriodo(periodo)}.
          </p>
        </header>

        {mensaje && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
            {mensaje}
          </div>
        )}

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
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as FiltroPago)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:w-48"
          >
            <option value="todos">Todos los estados</option>
            <option value="pagados">Pagos al día</option>
            <option value="pendientes">Por pagar</option>
          </select>
        </div>

        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{filas.length} alumno(s) encontrado(s)</p>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[820px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Alumno</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">DNI / Código</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Monto</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Estado del pago</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filas.map(({ alumno, pago }) => {
                const pagado = pago?.estado === "pagado";
                return (
                  <tr key={alumno.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-100">
                        {alumno.nombres} {alumno.apellidos}
                      </p>
                      <p className="text-xs text-slate-500">{alumno.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {alumno.dni}
                      <br />
                      {alumno.codigo}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{alumno.categoria}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {formatearMonto(pago?.monto ?? MONTO_MENSUALIDAD)}
                      {pago?.metodoPago && (
                        <span className="block text-xs text-slate-400">{pago.metodoPago}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          pagado
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : pago?.estado === "vencido"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                        }`}
                      >
                        {pagado ? "Pagado" : pago?.estado === "vencido" ? "Vencido" : pago ? "Por pagar" : "Sin registro"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {pagado ? (
                        <button
                          onClick={() => marcarComoDeuda(pago, alumno)}
                          className="rounded-lg bg-slate-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
                        >
                          Marcar deuda
                        </button>
                      ) : (
                        <button
                          onClick={() => abrirModalRegistro(alumno)}
                          className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary-hover"
                        >
                          Registrar pago
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
                >
                  Confirmar pago
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
    azul: "border-slate-200 text-slate-950",
    verde: "border-emerald-200 text-emerald-700",
    rojo: "border-red-200 text-red-700",
  };
  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 ${colores[tono]}`}>
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 text-2xl font-bold">{valor}</dd>
    </div>
  );
}