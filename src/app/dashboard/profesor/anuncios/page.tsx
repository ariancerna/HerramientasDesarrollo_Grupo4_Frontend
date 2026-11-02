"use client";

import { useMemo, useState } from "react";
import AnuncioCard from "@/components/anuncios/anuncio-card";
import AnuncioForm from "@/components/anuncios/anuncio-form";
import { RoleGuard } from "@/components/shared/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useAlumnos } from "@/store/alumnos-store";
import { useCategorias } from "@/store/categorias-store";
import {
  actualizarAnuncio,
  crearAnuncio,
  eliminarAnuncio,
  useAnuncios,
} from "@/store/anuncios-store";
import { ErrorBanner } from "@/components/shared/error-banner";
import { mensajeError } from "@/lib/api";
import { Anuncio, AnuncioFormData, EstadoAnuncio } from "@/types/anuncio";

export default function AnunciosProfesorPage() {
  const { session } = useAuth();
  const { confirm, dialog } = useConfirm();
  const profesorId = session?.usuario.id ?? "";
  const alumnos = useAlumnos();
  const categorias = useCategorias();
  const categoriasAsignadas = categorias.filter((categoria) => categoria.profesorIds?.includes(profesorId));
  const alumnosAsignados = alumnos.filter((alumno) => categoriasAsignadas.some((categoria) => categoria.nombre === alumno.categoria));
  // El backend devuelve solo los anuncios del profesor autenticado.
  const anuncios = useAnuncios();
  const [error, setError] = useState<string | null>(null);
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

  const guardar = async (data: AnuncioFormData, estado: EstadoAnuncio, id?: string) => {
    setError(null);
    try {
      if (id) {
        await actualizarAnuncio(id, data, estado);
      } else {
        await crearAnuncio(data, estado);
      }
      setMostrarFormulario(false);
      setAnuncioAEditar(null);
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar el anuncio."));
    }
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
    setError(null);
    try {
      await eliminarAnuncio(anuncio.id);
    } catch (err) {
      setError(mensajeError(err, "No se pudo eliminar el anuncio."));
    }
  };

  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <div>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
           
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Anuncios</h1>
            <p className="mt-1 text-sm text-slate-500">Envía avisos a tus alumnos y administra tus borradores.</p>
          </div>
          <button type="button" onClick={abrirNuevo} className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark">Nuevo anuncio</button>
        </header>

        <div className="mb-5">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
        </div>

        {anuncios.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">No tienes anuncios registrados.</div>
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
            alumnos={alumnosAsignados}
            categorias={categoriasAsignadas}
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