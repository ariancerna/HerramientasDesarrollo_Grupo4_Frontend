// Copia el motor de lectura de códigos (zxing-wasm) a /public para servirlo
// desde el mismo dominio, sin depender de un CDN externo. Se ejecuta en postinstall, predev y prebuild.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

try {
  // barcode-detector depende de zxing-wasm; se resuelve desde su carpeta para usar la misma versión.
  const desde = dirname(require.resolve("barcode-detector/ponyfill"));
  const origen = createRequire(join(desde, "x.js")).resolve("zxing-wasm/reader/zxing_reader.wasm");
  const destino = join(process.cwd(), "public", "zxing", "zxing_reader.wasm");
  if (!existsSync(origen)) throw new Error(`No existe ${origen}`);
  mkdirSync(dirname(destino), { recursive: true });
  copyFileSync(origen, destino);
  console.log("zxing_reader.wasm copiado a public/zxing/");
} catch (error) {
  // No se corta la instalación: el escáner usa el CDN de jsDelivr como respaldo.
  console.warn("No se pudo copiar zxing_reader.wasm:", error instanceof Error ? error.message : error);
}
