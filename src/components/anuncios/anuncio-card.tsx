import { Anuncio } from "@/types/anuncio";

interface AnuncioCardProps {
  anuncio: Anuncio;
  nombresDestinatarios: string[];
  nombreCategoria?: string;
  onEditar: (anuncio: Anuncio) => void;
  onEliminar: (anuncio: Anuncio) => void;
}

export default function AnuncioCard({
  anuncio,
  nombresDestinatarios,
  nombreCategoria,
  onEditar,
  onEliminar,
}: AnuncioCardProps) {
  const fecha = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(anuncio.fechaCreacion));

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">{anuncio.titulo}</h2>
          <p className="mt-1 text-xs text-slate-500">{fecha}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${anuncio.estado === "enviado" ? "bg-[#edf8e8] text-[#16794C]" : "bg-amber-100 text-amber-700"}`}>
          {anuncio.estado === "enviado" ? "Enviado" : "Borrador"}
        </span>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{anuncio.mensaje}</p>
      <p className="mt-4 text-xs font-semibold text-slate-500">
        Destinatarios: {nombreCategoria ?? `${nombresDestinatarios.length} alumno(s)`}
      </p>
      <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-3">
        <button type="button" onClick={() => onEditar(anuncio)} className="text-sm font-semibold text-[#16794C] hover:text-[#12613D]">Editar</button>
        <button type="button" onClick={() => onEliminar(anuncio)} className="text-sm font-medium text-red-600 hover:text-red-800">Eliminar</button>
      </div>
    </article>
  );
}