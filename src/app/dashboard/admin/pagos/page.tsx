"use client";

import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/shared/role-guard";
import { Student } from "@/types/student";
import { actualizarAlumno, obtenerAlumnos } from "@/store/alumnos-store";

type FiltroPago = "todos" | "pagados" | "pendientes";

export default function PagosAdminPage() {
  const [alumnos, setAlumnos] = useState<Student[]>(obtenerAlumnos);
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState<FiltroPago>("todos");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const alumnosFiltrados = useMemo(() => {
    const termino = texto.trim().toLowerCase();
    return alumnos.filter((alumno) => {
      const coincideTexto = !termino ||
        `${alumno.nombres} ${alumno.apellidos}`.toLowerCase().includes(termino) ||
        alumno.dni.includes(termino) || alumno.codigo.toLowerCase().includes(termino);
      const coincideFiltro = filtro === "todos" ||
        (filtro === "pagados" && alumno.estado === "activo") ||
        (filtro === "pendientes" && alumno.estado === "inactivo");
      return coincideTexto && coincideFiltro;
    });
  }, [alumnos, texto, filtro]);

  const registrarEstado = (alumno: Student, estado: Student["estado"]) => {
    actualizarAlumno(alumno.id, { ...alumno, estado });
    setAlumnos(obtenerAlumnos());
    setMensaje(estado === "activo"
      ? `Pago registrado para ${alumno.nombres} ${alumno.apellidos}.`
      : `Se marcó como pendiente el pago de ${alumno.nombres} ${alumno.apellidos}.`);
    window.setTimeout(() => setMensaje(null), 3000);
  };

  const pagados = alumnos.filter((alumno) => alumno.estado === "activo").length;
  const pendientes = alumnos.length - pagados;

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">ADMINISTRACIÓN</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Pagos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Registra los pagos y consulta las deudas pendientes de los alumnos.
          </p>
        </header>

        {mensaje && <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">{mensaje}</div>}

        <dl className="mb-5 grid gap-3 sm:grid-cols-3">
          <Resumen label="Alumnos" valor={alumnos.length} />
          <Resumen label="Pagos al día" valor={pagados} tono="verde" />
          <Resumen label="Por pagar" valor={pendientes} tono="rojo" />
        </dl>

        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row">
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar por nombre, DNI o código..." className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          <select value={filtro} onChange={(e) => setFiltro(e.target.value as FiltroPago)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16794C] dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:w-48">
            <option value="todos">Todos los estados</option>
            <option value="pagados">Pagos al día</option>
            <option value="pendientes">Por pagar</option>
          </select>
        </div>

        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{alumnosFiltrados.length} alumno(s) encontrado(s)</p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[760px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/60"><tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Alumno</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">DNI / Código</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Categoría</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Estado del pago</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Acción</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {alumnosFiltrados.map((alumno) => {
                const pagado = alumno.estado === "activo";
                return <tr key={alumno.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3"><p className="font-medium text-slate-800 dark:text-slate-100">{alumno.nombres} {alumno.apellidos}</p><p className="text-xs text-slate-500">{alumno.email}</p></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{alumno.dni}<br />{alumno.codigo}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{alumno.categoria}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${pagado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"}`}>{pagado ? "Pagado" : "Por pagar"}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => registrarEstado(alumno, pagado ? "inactivo" : "activo")} className={`rounded-lg px-3 py-2 text-xs font-bold text-white transition ${pagado ? "bg-slate-600 hover:bg-slate-700" : "bg-[#16794C] hover:bg-[#12613D]"}`}>{pagado ? "Marcar deuda" : "Registrar pago"}</button></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}

function Resumen({ label, valor, tono = "azul" }: { label: string; valor: number; tono?: "azul" | "verde" | "rojo" }) {
  const colores = { azul: "border-slate-200 text-slate-950 dark:border-slate-700 dark:text-white", verde: "border-emerald-200 text-emerald-700", rojo: "border-red-200 text-red-700" };
  return <div className={`rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 ${colores[tono]}`}><dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt><dd className="mt-1 text-2xl font-bold">{valor}</dd></div>;
}
