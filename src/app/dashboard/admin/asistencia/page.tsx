"use client";

import { avisar } from "@/components/ui/toaster";
import { useMemo, useState } from "react";
import AsistenciaForm from "@/components/forms/asistencia-form";
import { AsistenciaLista } from "@/components/shared/asistencia-lista";
import { RoleGuard } from "@/components/shared/role-guard";
import { ErrorBanner } from "@/components/shared/error-banner";
import { mensajeError } from "@/lib/api";
import {
  corregirAsistencia,
  filtrarAsistencias,
  RegistroAsistencia,
  useRegistrosAsistencia,
} from "@/store/asistencia-store";
import { useNombresCategorias } from "@/store/categorias-store";
import { DatosCorreccionAsistencia } from "@/types/asistencia";

export default function AsistenciaAdminPage() {
  const registros = useRegistrosAsistencia();
  const nombresCategorias = useNombresCategorias();
  const [error, setError] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [fecha, setFecha] = useState("");
  const [registroACorregir, setRegistroACorregir] =
    useState<RegistroAsistencia | null>(null);

  const registrosFiltrados = useMemo(
    () => filtrarAsistencias(registros, { texto, categoria, fecha }),
    [registros, texto, categoria, fecha],
  );

  const handleCorregir = async (datos: DatosCorreccionAsistencia) => {
    if (!registroACorregir) return;

    setError(null);
    try {
      await corregirAsistencia(registroACorregir.id, datos);
      setRegistroACorregir(null);
      avisar("La asistencia fue corregida correctamente.");
    } catch (err) {
      setError(mensajeError(err, "No se pudo corregir la asistencia."));
    }
  };

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
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
              className="w-full min-w-0 max-w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <label className="block min-w-0 md:w-52">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Categoría
            </span>
            <select
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
              className="w-full min-w-0 max-w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="todas">Todas las categorías</option>
              {nombresCategorias.map((nombre) => (
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
              className="w-full min-w-0 max-w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-lime/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>
        </section>

        <div className="mb-5">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
        </div>


        <AsistenciaLista
          registros={registrosFiltrados}
          onCorregir={(registro) => {
            avisar("");
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