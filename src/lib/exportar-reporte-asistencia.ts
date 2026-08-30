import type { RegistroAsistencia } from "@/types/asistencia";

const ENCABEZADOS = [
  "Estudiante",
  "DNI",
  "Categoría",
  "Fecha",
  "Hora",
  "Método",
];

function protegerFormula(valor: string) {
  return /^[=+\-@]/.test(valor) ? `'${valor}` : valor;
}

function escaparCelda(valor: string) {
  return `"${protegerFormula(valor).replaceAll('"', '""')}"`;
}

function fechaLocal(fecha: Date) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function crearCsvReporteAsistencia(registros: RegistroAsistencia[]) {
  const filas = registros.map((registro) => {
    const fecha = new Date(registro.fechaHora);
    const valores = [
      registro.estudiante,
      registro.dni,
      registro.categoria,
      fechaLocal(fecha),
      new Intl.DateTimeFormat("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(fecha),
      registro.metodo === "ESCANEO" ? "Escaneo" : "Manual",
    ];

    return valores.map(escaparCelda).join(";");
  });

  return `\uFEFF${[ENCABEZADOS.map(escaparCelda).join(";"), ...filas].join("\r\n")}`;
}

export function descargarCsvReporteAsistencia(
  registros: RegistroAsistencia[],
  ahora = new Date(),
) {
  const contenido = crearCsvReporteAsistencia(registros);
  const archivo = new Blob([contenido], { type: "text/csv;charset=utf-8" });
  const enlace = document.createElement("a");
  const url = URL.createObjectURL(archivo);

  enlace.href = url;
  enlace.download = `reporte-asistencia-${fechaLocal(ahora)}.csv`;
  enlace.style.display = "none";
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
