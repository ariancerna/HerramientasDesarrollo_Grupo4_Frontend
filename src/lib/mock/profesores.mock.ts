import { Profesor } from "@/types";
import { demoPassword } from "@/lib/demo-credentials";

export const MOCK_PROFESORES: Profesor[] = [
  {
    id: "prof-001",
    nombre: "Carlos Mendoza Vega",
    usuario: "cmendoza",
    password: demoPassword([112, 114, 111, 102, 101, 115, 111, 114, 49, 50, 51]),
    sedeId: "sede-002",
  },
];
