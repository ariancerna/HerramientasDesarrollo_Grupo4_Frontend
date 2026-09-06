"use client";

import { useMemo, useState } from "react";
import AnuncioCard from "@/components/anuncios/anuncio-card";
import AnuncioForm from "@/components/anuncios/anuncio-form";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerCategorias } from "@/store/categorias-store";
import {
  actualizarAnuncio,
  crearAnuncio,
  eliminarAnuncio,
  obtenerAnunciosPorProfesor,
} from "@/store/anuncios-store";
import { Anuncio, AnuncioFormData, EstadoAnuncio } from "@/types/anuncio";
import { Categoria } from "@/types";
import { Student } from "@/types/student";

export default function AnunciosProfesorPage() {
  const { session } = useAuth();
  const { confirm, dialog } = useConfirm();
  const profesorId = session?.usuario.id ?? "";
  const [alumnos] = useState<Student[]>(obtenerAlumnos);
  const [categorias] = useState<Categoria[]>(obtenerCategorias);
  const [anuncios, setAnuncios] = useState<Anuncio[]>(() => obtenerAnunciosPorProfesor(profesorId));
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [anuncioAEditar, setAnuncioAEditar] = useState<Anuncio | null>(null);

  const nombresAlumnos = useMemo(
    () => Object.fromEntries(alumnos.map((alumno) => [alumno.id, `${alumno.nombres} ${alumno.apellidos}`])),
    [alumnos],
  );

  const abrirNuevo = () => {
    setAnuncioAEditar(null);
    setMostrarFormulario(true);
  };

  const guardar = (data: AnuncioFormData, estado: EstadoAnuncio, id?: string) => {
    if (id) {
      const actualizado = actualizarAnuncio(id, data, estado);
      if (actualizado) setAnuncios((actuales) => actuales.map((anuncio) => anuncio.id === id ? actualizado : anuncio));
    } else {
      const nuevo = crearAnuncio(data, profesorId, estado);
      setAnuncios((actuales) => [nuevo, ...actuales]);
    }
    setMostrarFormulario(false);
    setAnuncioAEditar(null);
  };

  const eliminar = async (anuncio: Anuncio) => {
    const confirmado = await confirm({
      title: "Eliminar anuncio",
      message: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    });
    if (!confirmado) return;
    eliminarAnuncio(anuncio.id);
    setAnuncios((actuales) => actuales.filter((actual) => actual.id !== anuncio.id));
  };

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">PROFESOR</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Anuncios</h1>
            <p className="mt-1 text-sm text-slate-500">Envía avisos a tus alumnos y administra tus borradores.</p>
          </div>
          <button type="button" onClick={abrirNuevo} className="rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12613D]">Nuevo anuncio</button>
        </header>

        {anuncios.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No tienes anuncios registrados.</div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2" aria-label="Anuncios del profesor">
            {anuncios.map((anuncio) => (
              <AnuncioCard
                key={anuncio.id}
                anuncio={anuncio}
                nombresDestinatarios={anuncio.destinatarios.map((id) => nombresAlumnos[id]).filter(Boolean)}
                nombreCategoria={anuncio.categoriaId ? categorias.find((categoria) => categoria.id === anuncio.categoriaId)?.nombre : undefined}
                onEditar={(actual) => { setAnuncioAEditar(actual); setMostrarFormulario(true); }}
                onEliminar={eliminar}
              />
            ))}
          </section>
        )}

        {mostrarFormulario && (
          <AnuncioForm
            key={anuncioAEditar?.id ?? "nuevo"}
            alumnos={alumnos}
            categorias={categorias}
            anuncioAEditar={anuncioAEditar}
            onClose={() => { setMostrarFormulario(false); setAnuncioAEditar(null); }}
            onGuardar={guardar}
          />
        )}
        {dialog}
      </div>
    </RoleGuard>
  );
}