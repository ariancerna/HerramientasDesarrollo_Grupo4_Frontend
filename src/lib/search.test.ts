import { describe, expect, it } from "vitest";
import { normalizeSearchText } from "@/lib/search";

describe("normalización de búsqueda", () => {
  it("ignora mayúsculas, espacios y tildes", () => {
    expect(normalizeSearchText("  Configuración Ágil  ")).toBe(
      "configuracion agil",
    );
  });
});
