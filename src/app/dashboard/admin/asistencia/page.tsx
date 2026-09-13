"use client";

import { useMemo, useState } from "react";
import AsistenciaForm from "@/components/forms/asistencia-form";
import AsistenciaTabla from "@/components/shared/asistencia-tabla";
import { RoleGuard } from "@/components/shared/role-guard";
import { NOMBRES_CATEGORIAS } from "@/lib/mock/categorias.mock";
import {
  corregirAsistencia,
  filtrarAsistencias,
  obtenerRegistrosAsistencia,
  RegistroAsistencia,
} from "@/store/asistencia-store";
import { DatosCorreccionAsistencia } from "@/types/asistencia";

export default function AsistenciaAdminPage() {
  const [registros, setRegistros] = useState<RegistroAsistencia[]>(
    obtenerRegistrosAsistencia,
  );
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [fecha, setFecha] = useState("");
  const [registroACorregir, setRegistroACorregir] =
    useState<RegistroAsistencia | null>(null);
  const [mensajeExito, setMensajeExito] = useState("");

  const registrosFiltrados = useMemo(
    () => filtrarAsistencias(registros, { texto, categoria, fecha }),
    [registros, texto, categoria, fecha],
  );

  const handleCorregir = (datos: DatosCorreccionAsistencia) => {
    if (!registroACorregir) return;

    corregirAsistencia(registroACorregir.id, datos);
    setRegistros(obtenerRegistrosAsistencia());
    setRegistroACorregir(null);
    setMensajeExito("La asistencia fue corregida correctamente.");
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
          <header className="mb-6">
            <p className="text-sm font-semibold tracking-[0.1em] text-primary-dark">
              ADMINISTRACIÓN
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Corrección de asistencia
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Consulta los registros y corrige la fecha, hora o método cuando sea necesario.
            </p>
          </header>

          <section className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-end">
            <label className="block min-w-0 flex-1">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Buscar estudiante o DNI
              </span>
              <input
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                placeholder="Nombre o DNI..."
                className="w-full min-w-0 max-w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>

            <label className="block min-w-0 md:w-52">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Categoría
              </span>
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                className="w-full min-w-0 max-w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="todas">Todas las categorías</option>
                {NOMBRES_CATEGORIAS.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0 md:w-48">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Fecha
              </span>
              <input
                type="date"
                value={fecha}
                onChange={(event) => setFecha(event.target.value)}
                className="w-full min-w-0 max-w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
          </section>

          {mensajeExito && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              {mensajeExito}
            </div>
          )}

          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            {registrosFiltrados.length} registro(s) encontrado(s)
          </p>

          <AsistenciaTabla
            registros={registrosFiltrados}
            puedeCorregir
            onCorregir={(registro) => {
              setMensajeExito("");
              setRegistroACorregir(registro);
            }}
          />

          {registroACorregir && (
            <AsistenciaForm
              key={registroACorregir.id}
              registro={registroACorregir}
              onClose={() => setRegistroACorregir(null)}
              onGuardar={handleCorregir}
            />
          )}
      </div>
    </RoleGuard>
  );
}
