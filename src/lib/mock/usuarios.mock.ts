import { Usuario } from "@/types";
import { demoPassword } from "@/lib/demo-credentials";

export const MOCK_USUARIOS: Array<Usuario & { password: string }> = [
  {
    id: "u-001",
    usuario: "admin",
    password: demoPassword([97, 100, 109, 105, 110, 49, 50, 51]),
    nombre: "Administrador Golazo Club",
    rol: "administrador",
  },
  {
    id: "u-002",
    usuario: "profesor",
    password: demoPassword([112, 114, 111, 102, 101, 115, 111, 114, 49, 50, 51]),
    nombre: "Profesor Golazo Club",
    rol: "profesor",
  },
  {
    id: "u-003",
    usuario: "alumno",
    password: demoPassword([97, 108, 117, 109, 110, 111, 49, 50, 51]),
    nombre: "Valentina Rojas Perez",
    rol: "alumno",
    estudianteId: "alu-001",
  },
];
