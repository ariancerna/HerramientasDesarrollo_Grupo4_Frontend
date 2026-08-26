import { Role } from "@/types";

export const ROLES: Record<string, Role> = {
  ADMIN: "administrador",
  PROFESOR: "profesor",
  ALUMNO: "alumno",
};

// Ruta principal a la que se redirige cada rol después de iniciar sesión.
export const ROLE_HOME_ROUTE: Record<Role, string> = {
  administrador: "/dashboard/admin",
  profesor: "/dashboard/profesor",
  alumno: "/dashboard/alumno",
};