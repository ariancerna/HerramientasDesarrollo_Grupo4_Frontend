import Link from "next/link";

interface ModuloEnConstruccionProps {
  titulo: string;
  descripcion: string;
  icono: string;
}

export default function ModuloEnConstruccion({
  titulo,
  descripcion,
  icono,
}: ModuloEnConstruccionProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
          KickStamp · Administración
        </p>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="text-5xl" aria-hidden="true">
            {icono}
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            {titulo}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            {descripcion}
          </p>
          <div className="mt-6 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Módulo en desarrollo
          </div>
          <div className="mt-8">
            <Link
              href="/dashboard/admin"
              className="inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Volver al panel
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
