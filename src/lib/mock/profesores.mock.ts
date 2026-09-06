import { Profesor } from "@/types";

/**
 * Profesores adicionales dados de alta desde el panel de administración.
 * El profesor de demo (usuario "profesor") vive en usuarios.mock.ts junto
 * con el resto de cuentas de acceso garantizado y no se duplica aquí.
 */
export const MOCK_PROFESORES: Profesor[] = [
  {
    id: "prof-001",
    nombre: "Carlos Mendoza Vega",
    usuario: "cmendoza",
    password: "profesor123",
    sedeId: "sede-002",
  },
];
