import { api } from "@/lib/api";

export type RolCuenta = "ADM" | "PROF" | "ALU";

export interface UsuarioSistema {
  id: string;
  usuario: string;
  nombre: string;
  email: string;
  rol: RolCuenta;
  activo: boolean;
  createdAt: string;
  categorias: string[];
  ultimoAcceso: string | null;
  proveedores: string[];
}

export const ETIQUETA_ROL: Record<RolCuenta, string> = {
  ADM: "Administrador",
  PROF: "Profesor",
  ALU: "Alumno",
};

/** USR-04 — todas las cuentas del sistema. */
export function listarUsuarios() {
  return api<UsuarioSistema[]>("/usuarios");
}

/** USR-02 — habilitar o bloquear el acceso de una cuenta. */
export function cambiarEstadoUsuario(id: string, activo: boolean) {
  return api<{ id: string; activo: boolean }>(`/usuarios/${id}/estado`, { method: "PATCH", body: { activo } });
}

/** USR-03 — el admin asigna una contraseña nueva. */
export function restablecerPasswordUsuario(id: string, nuevaPassword: string) {
  return api<{ mensaje: string }>(`/usuarios/${id}/reset-password`, { method: "POST", body: { nuevaPassword } });
}

export function filtrarUsuarios(
  usuarios: UsuarioSistema[],
  { texto, rol, estado }: { texto: string; rol: RolCuenta | "todos"; estado: "todos" | "activo" | "inactivo" },
) {
  const consulta = texto.trim().toLowerCase();
  return usuarios.filter((u) => {
    if (rol !== "todos" && u.rol !== rol) return false;
    if (estado === "activo" && !u.activo) return false;
    if (estado === "inactivo" && u.activo) return false;
    if (!consulta) return true;
    return [u.nombre, u.usuario, u.email, ...u.categorias].some((valor) => valor.toLowerCase().includes(consulta));
  });
}

const relativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

/** "hace 2 horas", "ayer", "hace 3 meses"; "Nunca" si no ingresó. */
export function formatearUltimoAcceso(iso: string | null, ahora = new Date()) {
  if (!iso) return "Nunca";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "—";
  const segundos = Math.round((fecha.getTime() - ahora.getTime()) / 1000);
  const tramos: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60],
  ];
  for (const [unidad, duracion] of tramos) {
    if (Math.abs(segundos) >= duracion) return relativo.format(Math.round(segundos / duracion), unidad);
  }
  return "Hace un momento";
}
