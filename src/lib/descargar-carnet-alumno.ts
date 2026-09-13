import { BARCODE_HEIGHT, crearBarrasCodigoDni, obtenerAnchoCodigoBarras } from "@/lib/codigo-barras";
import type { Student } from "@/types/student";

function escaparHtml(valor: string): string {
  return valor.replace(/[&<>"]/g, (caracter) => {
    const entidades: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };
    return entidades[caracter];
  });
}

function generarSvgCodigoBarras(dni: string): string {
  const barras = crearBarrasCodigoDni(dni);
  const ancho = obtenerAnchoCodigoBarras(barras);
  const rectangulos = barras
    .map((barra) => `<rect x="${barra.x}" y="0" width="${barra.width}" height="${BARCODE_HEIGHT}" />`)
    .join("");

  return `<svg viewBox="0 0 ${ancho} ${BARCODE_HEIGHT}" preserveAspectRatio="none" aria-label="Código de barras del DNI ${escaparHtml(dni)}" role="img">${rectangulos}</svg>`;
}

/** Abre un carnet imprimible; desde el diálogo se puede guardar directamente como PDF. */
export function descargarCarnetAlumno(alumno: Student): void {
  const ventana = window.open("", "_blank", "width=560,height=740");
  if (!ventana) return;

  const nombreCompleto = escaparHtml(`${alumno.nombres} ${alumno.apellidos}`);
  const categoria = escaparHtml(alumno.categoria);
  const codigo = escaparHtml(alumno.codigo);
  const dni = escaparHtml(alumno.dni);
  const logoUrl = new URL("/logo-el-golazo-club.jpg", window.location.origin).href;

  ventana.document.write(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Carnet ${codigo}</title>
    <style>
      @page { size: 85.6mm 53.98mm; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0a1628; }
      .carnet { width: 85.6mm; height: 53.98mm; overflow: hidden; position: relative; padding: 2.5mm 5mm 8.5mm; background: linear-gradient(135deg, #f8fff8 0%, #ffffff 54%, #e6f6e9 100%); border: .45mm solid #16794c; }
      .carnet::after { content: ""; position: absolute; right: -12mm; top: -12mm; width: 40mm; height: 40mm; border-radius: 50%; background: #16794c; opacity: .08; }
      .logo { display: block; width: 20mm; height: 9mm; margin: 0 auto; object-fit: contain; position: relative; z-index: 1; }
      h1 { margin: .6mm 0 0; font-size: 11.5pt; line-height: 1.05; position: relative; z-index: 1; text-align: center; }
      .categoria { display: table; margin: 1.3mm auto 0; border-radius: 10mm; padding: .9mm 2.2mm; background: #e6f6e9; color: #16794c; font-size: 6.6pt; font-weight: 700; text-align: center; }
      .codigo { margin-top: 1.5mm; color: #64748b; font-size: 6.6pt; text-align: center; }
      .codigo strong { color: #0a1628; letter-spacing: .45pt; }
      .barras { margin-top: 1.8mm; border-radius: 1.2mm; background: #fff; padding: 1.4mm 2mm 1mm; }
      .barras svg { display: block; width: 100%; height: 10.5mm; fill: #0a1628; }
      .dni { margin: .7mm 0 0; color: #0a1628; text-align: center; font-family: "Courier New", monospace; font-size: 8pt; font-weight: 700; letter-spacing: 1.8pt; }
      .pie { margin-top: 1.2mm; color: #64748b; font-size: 5.8pt; text-align: center; }
      @media screen { body { min-height: 100vh; display: grid; place-items: center; background: #e2e8f0; } .carnet { box-shadow: 0 8px 24px rgba(15, 23, 42, .16); } }
    </style>
  </head>
  <body>
    <article class="carnet">
      <img class="logo" src="${logoUrl}" alt="Logo de El Golazo Club" />
      <h1>${nombreCompleto}</h1>
      <span class="categoria">${categoria}</span>
      <div class="codigo">Código de alumno: <strong>${codigo}</strong></div>
      <div class="barras">${generarSvgCodigoBarras(alumno.dni)}<p class="dni">${dni}</p></div>
      <div class="pie">Carnet personal - Presentar al ingresar al club</div>
    </article>
    <script>window.addEventListener("load", () => window.print());</script>
  </body>
</html>`);
  ventana.document.close();
}
