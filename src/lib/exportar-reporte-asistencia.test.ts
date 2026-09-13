import { describe, expect, it } from "vitest";
import { crearCsvReporteAsistencia } from "@/lib/exportar-reporte-asistencia";
import type { RegistroAsistencia } from "@/types/asistencia";

describe("exportación CSV", () => {
  it("genera un archivo compatible con Excel y protege fórmulas", () => {
    const registro: RegistroAsistencia = {
      id: "1",
      estudianteId: "a1",
      dni: "12345678",
      estudiante: "=SUM(1,1)",
      categoria: "Sub-10",
      fechaHora: "2026-09-13T15:30:00.000Z",
      metodo: "ESCANEO",
    };

    const csv = crearCsvReporteAsistencia([registro]);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("\"'=SUM(1,1)\"");
    expect(csv).toContain("\"Escaneo\"");
    expect(csv.split("\r\n")).toHaveLength(2);
  });
});
