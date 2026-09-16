"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { DashboardWelcomeBanner } from "@/components/shared/dashboard-welcome-banner";
import { useAuth } from "@/hooks/use-auth";
import { obtenerAlumnos } from "@/store/alumnos-store";
import { obtenerAsistenciasPorEstudiante } from "@/store/asistencia-store";
import { obtenerAnuncios } from "@/store/anuncios-store";
import { obtenerMensualidadActual, obtenerPagosPorEstudiante } from "@/store/pagos-store";
import { obtenerProximasActividades } from "@/store/calendario-store";

export default function AlumnoDashboardPage() {
  const { session } = useAuth();
  const primerNombre = session?.usuario.nombre.split(" ")[0] ?? "Alumno";
  const estudianteId = session?.usuario.estudianteId;
  const alumno = estudianteId ? obtenerAlumnos().find((item) => item.id === estudianteId) : undefined;
  const asistencias = estudianteId ? obtenerAsistenciasPorEstudiante(estudianteId) : [];
  const mensualidad = estudianteId ? obtenerMensualidadActual(estudianteId) : undefined;
  const pagos = estudianteId ? obtenerPagosPorEstudiante(estudianteId) : [];
  const actividades = alumno ? obtenerProximasActividades(alumno.categoria, new Date(), 3) : [];
  const proximaActividad = actividades[0];
  const periodoActual = fechaPeriodo(new Date());
  const asistenciasDelMes = asistencias.filter((registro) => fechaPeriodo(new Date(registro.fechaHora)) === periodoActual).length;
  const anuncios = estudianteId
    ? obtenerAnuncios()
        .filter((anuncio) => anuncio.estado === "enviado" && anuncio.destinatarios.includes(estudianteId))
        .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))
        .slice(0, 3)
    : [];
  const movimientos = [
    ...asistencias.map((registro) => ({ id: registro.id, titulo: "Asistencia registrada", detalle: registro.metodo === "ESCANEO" ? "Registro por escaneo" : "Registro manual", fecha: registro.fechaHora, tipo: "asistencia" as const })),
    ...pagos.filter((pago) => pago.estado === "pagado" && pago.fechaPago).map((pago) => ({ id: pago.id, titulo: "Pago registrado", detalle: pago.concepto, fecha: `${pago.fechaPago}T12:00:00`, tipo: "pago" as const })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 4);

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <div>
        <DashboardWelcomeBanner
          name={primerNombre}
          description="Consulta tu asistencia, mensualidades y próximas actividades."
          quote="Disciplina, trabajo en equipo y grandes resultados."
        />
        
        <section className="mt-6">
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <dt className="text-xs text-slate-500 dark:text-slate-400">Asistencias</dt>
                <dd className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">{asistencias.length}</dd>
              </dl>
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <dt className="text-xs text-slate-500 dark:text-slate-400">Estado de pago</dt>
                <dd className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                  {mensualidad?.estado === "pagado" ? "Al día" : "Pendiente"}
                </dd>
              </dl>
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <dt className="text-xs text-slate-500 dark:text-slate-400">Próxima actividad</dt>
                <dd className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                  {proximaActividad?.horaInicio ?? "Sin agenda"}
                </dd>
              </dl>
              <dl className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <dt className="text-xs text-slate-500 dark:text-slate-400">Categoría</dt>
                <dd className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-white">
                  {alumno?.categoria ?? "Por asignar"}
                </dd>
              </dl>
            </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.55fr_0.8fr_0.8fr]">
          {/* 🎨 CAMBIO: de brand-blue inexistente al verdadero token azul (brand-green) */}
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-dark p-6 text-white shadow-sm sm:p-7">
            <div className="absolute -right-9 -top-10 h-40 w-40 rounded-full border-[26px] border-white/10" aria-hidden="true" />
            <p className="relative text-xs font-bold uppercase tracking-[0.14em] text-brand-lime-light">Tu siguiente actividad</p>
            {proximaActividad ? (
              <>
                <h2 className="relative mt-3 text-2xl font-bold">{proximaActividad.titulo}</h2>
                <p className="relative mt-2 text-sm text-blue-50">
                  {proximaActividad.categoria} · {proximaActividad.ubicacion}
                </p>
                <div className="relative mt-6 flex items-end justify-between gap-4">
                  <p className="text-sm font-semibold">
                    {formatearActividad(proximaActividad.fecha, proximaActividad.horaInicio)}
                  </p>
                  {/* 🎨 CAMBIO: text-[#12613D] → text-brand-green-dark */}
                  <Link
                    href="/dashboard/alumno/calendario"
                    className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-brand-green-dark transition hover:bg-blue-50"
                  >
                    Ver agenda
                  </Link>
                </div>
              </>
            ) : (
              <p className="relative mt-3 text-sm text-blue-50">No tienes actividades programadas por ahora.</p>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Asistencias este mes</p>
            <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{asistenciasDelMes}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{asistencias.length} registros en tu historial</p>
            <Link href="/dashboard/alumno/historial" className="mt-4 inline-block text-xs font-bold text-brand-green dark:text-brand-lime-light">
              Ver historial →
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Mensualidad</p>
            <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
              {mensualidad?.estado === "pagado" ? "Al día" : mensualidad?.estado === "vencido" ? "Pago vencido" : "Pago pendiente"}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {mensualidad ? `Vence el ${formatearFechaCorta(mensualidad.vencimiento)}` : "Sin mensualidad registrada"}
            </p>
            {/* 🎨 CAMBIO: text-[#16794C] → text-brand-green */}
            <Link href="/dashboard/alumno/pagos" className="mt-4 inline-block text-xs font-bold text-brand-green dark:text-brand-lime-light">
              Ver detalle →
            </Link>
          </article>
        </section>

        <section className="mt-9 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]" aria-label="Agenda y novedades personales">
          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <PanelHeader title="Próximas actividades" description="Entrenamientos y eventos de tu categoría" href="/dashboard/alumno/calendario" linkLabel="Ver calendario" />
            {actividades.length ? (
              <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
                {actividades.map((actividad) => (
                  <div key={actividad.id} className="flex gap-4 py-4">
                    <DateBadge date={actividad.fecha} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-bold text-navy dark:text-slate-100">{actividad.titulo}</p>
                        <span className="rounded-full bg-brand-green-soft px-2 py-0.5 text-[10px] font-bold uppercase text-brand-green dark:bg-brand-green/15 dark:text-brand-lime-light">{actividad.tipo}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{actividad.horaInicio}{actividad.horaFin ? ` – ${actividad.horaFin}` : ""}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">{actividad.ubicacion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No tienes actividades programadas." />
            )}
          </article>

          <div className="grid gap-4">
            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <PanelHeader title="Avisos para ti" description="Comunicados de tu profesor" />
              {anuncios.length ? (
                <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
                  {anuncios.map((anuncio) => (
                    <div key={anuncio.id} className="py-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-lime" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-navy dark:text-slate-100">{anuncio.titulo}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{anuncio.mensaje}</p>
                          <p className="mt-2 text-[11px] font-medium text-slate-400">{formatearFechaHora(anuncio.fechaCreacion)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No tienes avisos nuevos." />
              )}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <PanelHeader title="Últimos movimientos" description="Asistencias y pagos registrados" />
              {movimientos.length ? (
                <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
                  {movimientos.map((movimiento) => (
                    <div key={`${movimiento.tipo}-${movimiento.id}`} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">{movimiento.titulo}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{movimiento.detalle}</p>
                      </div>
                      <span className="whitespace-nowrap text-[11px] font-medium text-slate-400">{formatearFechaHora(movimiento.fecha)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="Todavía no hay movimientos." />
              )}
            </article>
          </div>
        </section>
      </div>
    </RoleGuard>
  );
}

function formatearActividad(fecha: string, hora: string) {
  return `${new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "short" }).format(new Date(`${fecha}T12:00:00`))} · ${hora}`;
}
function formatearFechaCorta(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${fecha}T12:00:00`));
}
function fechaPeriodo(fecha: Date) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
}
function formatearFechaHora(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(fecha));
}

function PanelHeader({ title, description, href, linkLabel }: { title: string; description: string; href?: string; linkLabel?: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800"><div><h2 className="font-bold text-navy dark:text-white">{title}</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p></div>{href && linkLabel ? <Link href={href} className="whitespace-nowrap text-xs font-bold text-brand-green dark:text-brand-lime-light">{linkLabel} →</Link> : null}</div>;
}

function DateBadge({ date }: { date: string }) {
  const fecha = new Date(`${date}T12:00:00`);
  return <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-green-soft text-center dark:bg-brand-green/15"><div><span className="block text-lg font-black leading-none text-brand-green dark:text-brand-lime-light">{fecha.getDate()}</span><span className="mt-1 block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{new Intl.DateTimeFormat("es-PE", { month: "short" }).format(fecha).replace(".", "")}</span></div></div>;
}

function EmptyState({ message }: { message: string }) { return <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">{message}</p>; }
