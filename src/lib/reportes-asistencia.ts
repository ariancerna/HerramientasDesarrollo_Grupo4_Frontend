import type { MetodoAsistencia, RegistroAsistencia } from "@/types/asistencia";

export interface FiltrosReporteAsistencia {
  categoria: string;
  fechaDesde: string;
  fechaHasta: string;
  metodo: MetodoAsistencia | "todos";
}

export interface DistribucionAsistencia {
  etiqueta: string;
  cantidad: number;
}

export interface IndicadoresAsistencia {
  totalAsistencias: number;
  estudiantesUnicos: number;
  diasConActividad: number;
  promedioPorDia: number;
  porcentajeEscaneo: number;
  porCategoria: DistribucionAsistencia[];
  porFecha: DistribucionAsistencia[];
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

export function calcularIndicadoresAsistencia(
  registros: RegistroAsistencia[],
): IndicadoresAsistencia {
  const estudiantes = new Set<string>();
  const categorias = new Map<string, number>();
  const fechas = new Map<string, number>();
  let registrosPorEscaneo = 0;

  registros.forEach((registro) => {
    estudiantes.add(registro.estudianteId);
    categorias.set(
      registro.categoria,
      (categorias.get(registro.categoria) ?? 0) + 1,
    );

    const fecha = fechaLocal(registro.fechaHora);
    fechas.set(fecha, (fechas.get(fecha) ?? 0) + 1);

    if (registro.metodo === "ESCANEO") {
      registrosPorEscaneo += 1;
    }
  });

  const totalAsistencias = registros.length;
  const diasConActividad = fechas.size;

  return {
    totalAsistencias,
    estudiantesUnicos: estudiantes.size,
    diasConActividad,
    promedioPorDia:
      diasConActividad === 0 ? 0 : totalAsistencias / diasConActividad,
    porcentajeEscaneo:
      totalAsistencias === 0
        ? 0
        : (registrosPorEscaneo / totalAsistencias) * 100,
    porCategoria: [...categorias.entries()]
      .map(([etiqueta, cantidad]) => ({ etiqueta, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad || a.etiqueta.localeCompare(b.etiqueta)),
    porFecha: [...fechas.entries()]
      .map(([etiqueta, cantidad]) => ({ etiqueta, cantidad }))
      .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta)),
  };
}
