import { Usuario } from "@/types";

export const MOCK_USUARIOS: Array<Usuario & { password: string }> = [
  {
    id: "u-001",
    usuario: "admin",
    password: "admin123",
    nombre: "Administrador Golazo Club",
    rol: "administrador",
  },
  {
    id: "u-002",
    usuario: "profesor",
    password: "profesor123",
    nombre: "Profesor Golazo Club",
    rol: "profesor",
  },
  {
    id: "u-003",
    usuario: "alumno",
    password: "alumno123",
    nombre: "Valentina Rojas Pérez",
    rol: "alumno",
    estudianteId: "alu-001",
  },
];
