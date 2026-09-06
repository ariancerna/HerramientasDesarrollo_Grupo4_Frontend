import Link from "next/link";

type ModuleIcon = "tag" | "chart" | "settings";

interface ModuloEnConstruccionProps {
  titulo: string;
  descripcion: string;
  icono: ModuleIcon;
}

export default function ModuloEnConstruccion({ titulo, descripcion, icono }: ModuloEnConstruccionProps) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-[0.1em] text-[#16794C]">ADMINISTRACIÓN</p>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#edf8e8] text-[#16794C]"><ModuleIconGraphic name={icono} /></span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#0A1628]">{titulo}</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">{descripcion}</p>
        <div className="mt-6 inline-flex rounded-full bg-[#edf8e8] px-3 py-1 text-xs font-semibold text-[#16794C]">Módulo en desarrollo</div>
        <div className="mt-8">
          <Link href="/dashboard/admin" className="inline-flex rounded-lg bg-[#16794C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12613D] focus:outline-none focus:ring-2 focus:ring-[#16794C] focus:ring-offset-2">Volver al panel</Link>
        </div>
      </section>
    </div>
  );
}

function ModuleIconGraphic({ name }: { name: ModuleIcon }) {
  if (name === "chart") return <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (name === "settings") return <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true"><path d="M11.5 3H5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .59 1.41l8.5 8.5a2 2 0 0 0 2.82 0l6.5-6.5a2 2 0 0 0 0-2.82l-8.5-8.5A2 2 0 0 0 11.5 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /></svg>;
}
