"use client";

import { useState } from "react";
import { Pencil, UserMinus } from "lucide-react";
import type { Student } from "@/types/student";
import { TablaDatos, type Columna } from "@/components/ui/tabla-datos";
import { DatoDetalle, PanelLateral } from "@/components/ui/panel-lateral";
import { InsigniaEstado } from "@/components/ui/insignia-estado";
import UserAvatar from "@/components/shared/user-avatar";

interface AlumnoListaProps {
  alumnos: Student[];
  /** Sin onEditar ni onEliminar la lista es de solo lectura (vista del profesor). */
  onEditar?: (alumno: Student) => void;
  cargando?: boolean;
  onEliminar?: (alumno: Student) => void;
}

const nombreCompleto = (alumno: Student) => `${alumno.nombres} ${alumno.apellidos}`;

function Identidad({ alumno }: { alumno: Student }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar nombre={alumno.nombres} fotoUrl={alumno.fotoUrl} className="h-9 w-9 bg-brand-green-soft text-sm font-bold text-brand-green dark:text-brand-lime-light" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{nombreCompleto(alumno)}</p>
        <p className="truncate text-xs text-muted">{alumno.codigo || "Sin código"}</p>
      </div>
    </div>
  );
}

/** Padrón de alumnos: tabla ordenable con detalle en un panel lateral. */
export function AlumnoLista({ alumnos, onEditar, onEliminar, cargando = false }: AlumnoListaProps) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const seleccionado = alumnos.find((alumno) => alumno.id === seleccionadoId) ?? null;

  const soloLectura = !onEditar && !onEliminar;

  const acciones = (alumno: Student) => (
    <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
      {onEditar && (
        <button type="button" onClick={() => onEditar(alumno)} aria-label={`Editar a ${nombreCompleto(alumno)}`} title="Editar" className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-ink">
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {onEliminar && alumno.estado === "activo" && (
        <button type="button" onClick={() => onEliminar(alumno)} aria-label={`Dar de baja a ${nombreCompleto(alumno)}`} title="Dar de baja" className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400">
          <UserMinus className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const columnas: Columna<Student>[] = [
    { clave: "nombre", encabezado: "Alumno", celda: (a) => <Identidad alumno={a} />, orden: (a) => nombreCompleto(a) },
    { clave: "dni", encabezado: "DNI", celda: (a) => <span className="num">{a.dni}</span>, orden: (a) => a.dni },
    { clave: "categoria", encabezado: "Categoría", celda: (a) => a.categoria || <span className="text-muted">Sin categoría</span>, orden: (a) => a.categoria },
    { clave: "telefono", encabezado: "Teléfono", celda: (a) => <span className="num">{a.telefono || "—"}</span>, clase: "hidden lg:table-cell" },
    { clave: "estado", encabezado: "Estado", celda: (a) => <InsigniaEstado estado={a.estado} />, orden: (a) => a.estado },
    ...(soloLectura ? [] : [{ clave: "acciones", encabezado: "", celda: acciones, clase: "w-24 text-right" }]),
  ];

  return (
    <>
      <TablaDatos
        cargando={cargando}
        etiqueta="Alumnos"
        filas={alumnos}
        columnas={columnas}
        claveFila={(a) => a.id}
        ordenInicial="nombre"
        onFilaClick={(a) => setSeleccionadoId(a.id)}
        vacio="No se encontraron alumnos con esos filtros."
        tarjeta={(a) => (
          <div className="flex items-center justify-between gap-3">
            <Identidad alumno={a} />
            <InsigniaEstado estado={a.estado} />
          </div>
        )}
      />

      <PanelLateral
        abierto={Boolean(seleccionado)}
        onCerrar={() => setSeleccionadoId(null)}
        titulo={seleccionado ? nombreCompleto(seleccionado) : ""}
        subtitulo={seleccionado?.categoria || "Sin categoría asignada"}
        pie={
          seleccionado && !soloLectura && (
            <>
              {onEditar && (
                <button type="button" onClick={() => onEditar(seleccionado)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark">
                  <Pencil className="h-4 w-4" /> Editar
                </button>
              )}
              {onEliminar && seleccionado.estado === "activo" && (
                <button type="button" onClick={() => onEliminar(seleccionado)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10">
                  <UserMinus className="h-4 w-4" /> Dar de baja
                </button>
              )}
            </>
          )
        }
      >
        {seleccionado && (
          <>
            <div className="mb-4 flex items-center gap-4">
              <UserAvatar nombre={seleccionado.nombres} fotoUrl={seleccionado.fotoUrl} className="h-16 w-16 bg-brand-green text-xl font-bold text-white" />
              <InsigniaEstado estado={seleccionado.estado} />
            </div>
            <dl className="divide-y divide-line">
              <DatoDetalle etiqueta="DNI" valor={<span className="num">{seleccionado.dni}</span>} />
              <DatoDetalle etiqueta="Código" valor={seleccionado.codigo || "Sin código"} />
              <DatoDetalle etiqueta="Correo" valor={seleccionado.email || "—"} />
              <DatoDetalle etiqueta="Teléfono" valor={seleccionado.telefono || "—"} />
              <DatoDetalle etiqueta="Categoría" valor={seleccionado.categoria || "Sin categoría"} />
            </dl>
          </>
        )}
      </PanelLateral>
    </>
  );
}
