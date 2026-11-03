"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Categoria, Profesor } from "@/types";
import { TablaDatos, type Columna } from "@/components/ui/tabla-datos";
import { DatoDetalle, PanelLateral } from "@/components/ui/panel-lateral";
import UserAvatar from "@/components/shared/user-avatar";
import { useSedes } from "@/store/sedes-store";

interface ProfesorListaProps {
  profesores: Profesor[];
  categorias: Categoria[];
  onEditar: (profesor: Profesor) => void;
  cargando?: boolean;
  onEliminar: (profesor: Profesor) => void;
}

function Identidad({ profesor }: { profesor: Profesor }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar nombre={profesor.nombre} className="h-9 w-9 bg-brand-green-soft text-sm font-bold text-brand-green dark:text-brand-lime-light" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{profesor.nombre}</p>
        <p className="truncate text-xs text-muted">@{profesor.usuario}</p>
      </div>
    </div>
  );
}

function Chips({ nombres }: { nombres: string[] }) {
  if (nombres.length === 0) return <span className="text-xs text-muted">Sin categorías</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {nombres.map((nombre) => (
        <span key={nombre} className="rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink">{nombre}</span>
      ))}
    </div>
  );
}

/** Plantel de profesores: tabla ordenable con detalle en un panel lateral. */
export function ProfesorLista({ profesores, categorias, onEditar, onEliminar, cargando = false }: ProfesorListaProps) {
  const sedes = useSedes();
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const seleccionado = profesores.find((p) => p.id === seleccionadoId) ?? null;

  const categoriasDe = (profesorId: string) =>
    categorias.filter((categoria) => categoria.profesorIds?.includes(profesorId)).map((categoria) => categoria.nombre);
  const sedeDe = (profesor: Profesor) => sedes.find((sede) => sede.id === profesor.sedeId)?.nombre ?? "Sin sede";

  const columnas: Columna<Profesor>[] = [
    { clave: "nombre", encabezado: "Profesor", celda: (p) => <Identidad profesor={p} />, orden: (p) => p.nombre },
    { clave: "sede", encabezado: "Sede", celda: (p) => sedeDe(p), orden: (p) => sedeDe(p) },
    { clave: "categorias", encabezado: "Categorías a cargo", celda: (p) => <Chips nombres={categoriasDe(p.id)} />, orden: (p) => categoriasDe(p.id).length },
    { clave: "correo", encabezado: "Correo", celda: (p) => <span className="text-body">{p.email || "—"}</span>, clase: "hidden xl:table-cell" },
    {
      clave: "acciones",
      encabezado: "",
      clase: "w-24 text-right",
      celda: (p) => (
        <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => onEditar(p)} aria-label={`Editar a ${p.nombre}`} title="Editar" className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-ink">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onEliminar(p)} aria-label={`Eliminar a ${p.nombre}`} title="Eliminar" className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <TablaDatos
        cargando={cargando}
        etiqueta="Profesores"
        filas={profesores}
        columnas={columnas}
        claveFila={(p) => p.id}
        ordenInicial="nombre"
        onFilaClick={(p) => setSeleccionadoId(p.id)}
        vacio="No se encontraron profesores."
        tarjeta={(p) => (
          <div className="space-y-2">
            <Identidad profesor={p} />
            <Chips nombres={categoriasDe(p.id)} />
          </div>
        )}
      />

      <PanelLateral
        abierto={Boolean(seleccionado)}
        onCerrar={() => setSeleccionadoId(null)}
        titulo={seleccionado?.nombre ?? ""}
        subtitulo={seleccionado ? `@${seleccionado.usuario}` : undefined}
        pie={
          seleccionado && (
            <>
              <button type="button" onClick={() => onEditar(seleccionado)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark">
                <Pencil className="h-4 w-4" /> Editar
              </button>
              <button type="button" onClick={() => onEliminar(seleccionado)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" /> Eliminar
              </button>
            </>
          )
        }
      >
        {seleccionado && (
          <>
            <UserAvatar nombre={seleccionado.nombre} className="mb-4 h-16 w-16 bg-brand-green text-xl font-bold text-white" />
            <dl className="divide-y divide-line">
              <DatoDetalle etiqueta="Correo" valor={seleccionado.email || "—"} />
              <DatoDetalle etiqueta="Sede" valor={sedeDe(seleccionado)} />
            </dl>
            <h3 className="mb-2 mt-5 text-sm font-semibold text-ink">Categorías a cargo</h3>
            <Chips nombres={categoriasDe(seleccionado.id)} />
          </>
        )}
      </PanelLateral>
    </>
  );
}
