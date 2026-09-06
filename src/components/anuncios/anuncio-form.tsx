"use client";

import { useState } from "react";
import AnuncioDestinatarios, { ModoDestinatarios } from "@/components/anuncios/anuncio-destinatarios";
import { Categoria } from "@/types";
import { Student } from "@/types/student";
import { Anuncio, AnuncioFormData, EstadoAnuncio } from "@/types/anuncio";

interface AnuncioFormProps {
  alumnos: Student[];
  categorias: Categoria[];
  anuncioAEditar: Anuncio | null;
  onClose: () => void;
  onGuardar: (data: AnuncioFormData, estado: EstadoAnuncio, id?: string) => void;
}

function obtenerModoInicial(anuncio: Anuncio | null, alumnos: Student[]): ModoDestinatarios {
  if (!anuncio) return "todos";
  if (anuncio.categoriaId) return "categoria";
  if (anuncio.destinatarios.length === alumnos.length) return "todos";
  return "seleccionados";
}

export default function AnuncioForm({
  alumnos,
  categorias,
  anuncioAEditar,
  onClose,
  onGuardar,
}: AnuncioFormProps) {
  const [titulo, setTitulo] = useState(anuncioAEditar?.titulo ?? "");
  const [mensaje, setMensaje] = useState(anuncioAEditar?.mensaje ?? "");
  const [modo, setModo] = useState<ModoDestinatarios>(() => obtenerModoInicial(anuncioAEditar, alumnos));
  const [categoriaId, setCategoriaId] = useState(anuncioAEditar?.categoriaId ?? "");
  const [seleccionados, setSeleccionados] = useState<string[]>(anuncioAEditar?.destinatarios ?? []);
  const [errores, setErrores] = useState<string[]>([]);

  const obtenerDestinatarios = () => {
    if (modo === "todos") return alumnos.map((alumno) => alumno.id);
    if (modo === "categoria") {
      const categoria = categorias.find((actual) => actual.id === categoriaId);
      return alumnos
        .filter((alumno) => alumno.categoria === categoria?.nombre)
        .map((alumno) => alumno.id);
    }
    return seleccionados;
  };

  const guardar = (event: React.FormEvent, estado: EstadoAnuncio) => {
    event.preventDefault();
    const nuevosErrores: string[] = [];
    const destinatarios = obtenerDestinatarios();
    if (!titulo.trim()) nuevosErrores.push("El título es obligatorio.");
    if (!mensaje.trim()) nuevosErrores.push("El mensaje es obligatorio.");
    if (destinatarios.length === 0) nuevosErrores.push("Selecciona al menos un destinatario.");
    if (modo === "categoria" && !categoriaId) nuevosErrores.push("Selecciona una categoría.");
    setErrores(nuevosErrores);
    if (nuevosErrores.length > 0) return;

    onGuardar(
      {
        titulo: titulo.trim(),
        mensaje: mensaje.trim(),
        destinatarios,
        categoriaId: modo === "categoria" ? categoriaId : undefined,
      },
      estado,
      anuncioAEditar?.id,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-8">
      <div role="dialog" aria-modal="true" aria-labelledby="anuncio-form-title" className="my-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="anuncio-form-title" className="text-lg font-bold text-slate-950">
              {anuncioAEditar ? "Editar anuncio" : "Nuevo anuncio"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Redacta un aviso para tus alumnos.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar ventana" className="grid h-8 w-8 place-items-center rounded-lg text-xl leading-none text-slate-500 hover:bg-slate-100">×</button>
        </div>

        <form className="mt-5 space-y-4">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Título</span>
            <input value={titulo} onChange={(event) => setTitulo(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30" placeholder="Título del anuncio" />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Mensaje</span>
            <textarea rows={4} value={mensaje} onChange={(event) => setMensaje(event.target.value)} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16794C] focus:ring-2 focus:ring-[#6FCF3A]/30" placeholder="Escribe el aviso para tus alumnos..." />
          </label>

          <AnuncioDestinatarios
            alumnos={alumnos}
            categorias={categorias}
            modo={modo}
            categoriaId={categoriaId}
            seleccionados={seleccionados}
            onModoChange={setModo}
            onCategoriaChange={setCategoriaId}
            onSeleccionadosChange={setSeleccionados}
          />

          {errores.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errores.map((error) => <p key={error}>{error}</p>)}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
            <button type="button" onClick={(event) => guardar(event, "borrador")} className="rounded-lg border border-[#16794C] px-4 py-2.5 text-sm font-bold text-[#16794C] hover:bg-[#edf8e8]">Guardar borrador</button>
            <button type="button" onClick={(event) => guardar(event, "enviado")} className="rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12613D]">Enviar anuncio</button>
          </div>
        </form>
      </div>
    </div>
  );
}