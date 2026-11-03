import { Anuncio } from "@/types/anuncio";
import { InsigniaEstado } from "@/components/ui/insignia-estado";

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
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{anuncio.titulo}</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{fecha}</p>
        </div>
        <InsigniaEstado estado={anuncio.estado} />
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">{anuncio.mensaje}</p>
      <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        Destinatarios: {nombreCategoria ?? `${nombresDestinatarios.length} ${nombresDestinatarios.length === 1 ? "alumno" : "alumnos"}`}
      </p>
      <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button type="button" onClick={() => onEditar(anuncio)} className="text-sm font-semibold text-brand-green hover:text-brand-green-dark">Editar</button>
        <button type="button" onClick={() => onEliminar(anuncio)} className="text-sm font-medium text-red-600 hover:text-red-800">Eliminar</button>
      </div>
    </article>
  );
}