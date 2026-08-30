import type { MetodoAsistencia, RegistroAsistencia } from "@/types/asistencia";

export interface FiltrosReporteAsistencia {
  categoria: string;
  fechaDesde: string;
  fechaHasta: string;
  metodo: MetodoAsistencia | "todos";
}

export const FILTROS_REPORTE_INICIALES: FiltrosReporteAsistencia = {
  categoria: "todas",
  fechaDesde: "",
  fechaHasta: "",
  metodo: "todos",
};

function fechaLocal(fechaHora: string) {
  const fecha = new Date(fechaHora);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validarPeriodoReporte(
  filtros: FiltrosReporteAsistencia,
): string | null {
  if (
    filtros.fechaDesde &&
    filtros.fechaHasta &&
    filtros.fechaDesde > filtros.fechaHasta
  ) {
    return "La fecha de inicio no puede ser posterior a la fecha de fin.";
  }

  return null;
}

export function generarReporteAsistencia(
  registros: RegistroAsistencia[],
  filtros: FiltrosReporteAsistencia,
): RegistroAsistencia[] {
  return registros.filter((registro) => {
    const fechaRegistro = fechaLocal(registro.fechaHora);
    const coincideCategoria =
      filtros.categoria === "todas" ||
      registro.categoria === filtros.categoria;
    const coincideMetodo =
      filtros.metodo === "todos" || registro.metodo === filtros.metodo;
    const coincideFechaDesde =
      filtros.fechaDesde === "" || fechaRegistro >= filtros.fechaDesde;
    const coincideFechaHasta =
      filtros.fechaHasta === "" || fechaRegistro <= filtros.fechaHasta;

    return (
      coincideCategoria &&
      coincideMetodo &&
      coincideFechaDesde &&
      coincideFechaHasta
    );
  });
}
