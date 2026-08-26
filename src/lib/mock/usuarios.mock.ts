import { Usuario } from "@/types";

export const MOCK_USUARIOS: Array<Usuario & { password: string }> = [
  {
    id: "u-001",
    usuario: "admin",
    password: "admin123",
    nombre: "Administrador Golazo Club",
    rol: "administrador",
  },
];
