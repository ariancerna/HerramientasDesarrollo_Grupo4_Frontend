import { describe, expect, it } from "vitest";
import {
  calcularIndicadoresAsistencia,
  generarReporteAsistencia,
  obtenerPeriodoRapido,
  procesarResultadosReporte,
} from "@/lib/reportes-asistencia";
import type { RegistroAsistencia } from "@/types/asistencia";

const REGISTROS: RegistroAsistencia[] = [
  {
    id: "1",
    estudianteId: "a1",
    dni: "12345678",
    estudiante: "Ángela Ruiz",
    categoria: "Sub-10",
    fechaHora: "2026-09-10T15:00:00.000Z",
    metodo: "ESCANEO",
  },
  {
    id: "2",
    estudianteId: "a2",
    dni: "87654321",
    estudiante: "Bruno Díaz",
    categoria: "Sub-12",
    fechaHora: "2026-09-11T15:00:00.000Z",
    metodo: "MANUAL",
  },
  {
    id: "3",
    estudianteId: "a1",
    dni: "12345678",
    estudiante: "Ángela Ruiz",
    categoria: "Sub-10",
    fechaHora: "2026-09-11T16:00:00.000Z",
    metodo: "ESCANEO",
  },
];

describe("reportes de asistencia", () => {
  it("combina filtros de fecha, categoría y método", () => {
    const resultado = generarReporteAsistencia(REGISTROS, {
      fechaDesde: "2026-09-11",
      fechaHasta: "2026-09-11",
      categoria: "Sub-10",
      metodo: "ESCANEO",
    });

    expect(resultado.map((registro) => registro.id)).toEqual(["3"]);
  });

  it("calcula indicadores sin duplicar estudiantes", () => {
    const indicadores = calcularIndicadoresAsistencia(REGISTROS);

    expect(indicadores.totalAsistencias).toBe(3);
    expect(indicadores.estudiantesUnicos).toBe(2);
    expect(indicadores.diasConActividad).toBe(2);
    expect(indicadores.porcentajeEscaneo).toBeCloseTo(66.67, 1);
  });

  it("busca sin distinguir tildes y ordena por nombre", () => {
    const resultado = procesarResultadosReporte(REGISTROS, "angela", "nombre-asc");

    expect(resultado).toHaveLength(2);
    expect(resultado.every((registro) => registro.estudianteId === "a1")).toBe(true);
  });

  it("crea el periodo de los últimos treinta días incluyendo hoy", () => {
    const periodo = obtenerPeriodoRapido(
      "ultimos-30-dias",
      new Date(2026, 8, 13, 12),
    );

    expect(periodo).toEqual({
      fechaDesde: "2026-08-15",
      fechaHasta: "2026-09-13",
    });
  });
});
