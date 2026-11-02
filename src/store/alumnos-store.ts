import {
  Student,
  StudentFormData,
  StudentProfileData,
} from "@/types/student";
import { api, apiTodasLasPaginas } from "@/lib/api";
import { crearColeccionRemota, useColeccion } from "@/lib/remote-collection";
import { isStudent } from "@/lib/storage-validators";
import { getSession } from "@/store/auth-store";
import { obtenerCategorias } from "@/store/categorias-store";

/** Alumno tal como lo devuelve el backend (contrato v1, camelCase). */
interface AlumnoApi {
  id: string;
  dni: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  estado: Student["estado"];
  fotoUrl: string | null;
  categoria: string | null;
}

function aStudent(alumno: AlumnoApi): Student {
  return {
    id: alumno.id,
    dni: alumno.dni,
    codigo: alumno.codigo ?? "",
    nombres: alumno.nombres,
    apellidos: alumno.apellidos,
    email: alumno.email ?? "",
    telefono: alumno.telefono ?? undefined,
    fotoUrl: alumno.fotoUrl ?? undefined,
    categoria: alumno.categoria ?? "",
    estado: alumno.estado,
  };
}

async function cargarAlumnos(): Promise<Student[]> {
  // Un alumno no puede listar a los demás: solo se carga su propio perfil.
  if (getSession()?.usuario.rol === "alumno") {
    const perfil = await api<AlumnoApi | null>("/me/perfil");
    return perfil ? [aStudent(perfil)] : [];
  }
  return (await apiTodasLasPaginas<AlumnoApi>("/alumnos")).map(aStudent);
}

const alumnos = crearColeccionRemota<Student>("alumnos", cargarAlumnos);

/** Snapshot actual de alumnos (ADM/PROF: los visibles para su rol; ALU: su perfil). */
export const obtenerAlumnos = alumnos.obtener;
export const suscribirAlumnos = alumnos.suscribir;
export const useAlumnos = () => useColeccion(alumnos);
export const alumnosCargados = alumnos.cargada;

export function obtenerAlumnoPorId(id: string): Student | undefined {
  return obtenerAlumnos().find((alumno) => alumno.id === id);
}

function categoriaIdPorNombre(nombre: string): string {
  const categoria = obtenerCategorias().find((item) => item.nombre === nombre);
  if (!categoria) {
    throw new Error("Selecciona una categoría registrada antes de guardar el alumno.");
  }
  return categoria.id;
}

function cuerpoAlumno(data: StudentFormData) {
  return {
    dni: data.dni.trim(),
    // El código es opcional: si se omite, el backend genera uno (GC-AAAA-NNN).
    codigo: data.codigo.trim() || undefined,
    nombres: data.nombres.trim(),
    apellidos: data.apellidos.trim(),
    email: data.email.trim(),
    categoriaId: categoriaIdPorNombre(data.categoria),
    estado: data.estado,
  };
}

/** US-04: crea un nuevo alumno. */
export async function crearAlumno(data: StudentFormData): Promise<void> {
  await api("/alumnos", { method: "POST", body: cuerpoAlumno(data) });
  await alumnos.recargar();
}

/** US-04: actualiza los datos de un alumno existente. */
export async function actualizarAlumno(id: string, data: StudentFormData): Promise<void> {
  await api(`/alumnos/${id}`, { method: "PUT", body: cuerpoAlumno(data) });
  await alumnos.recargar();
}

/** Actualiza únicamente los datos que el alumno puede gestionar desde su perfil. */
export async function actualizarPerfilAlumno(data: StudentProfileData): Promise<Student> {
  const perfil = await api<AlumnoApi>("/me/perfil", {
    method: "PATCH",
    body: {
      nombres: data.nombres.trim(),
      apellidos: data.apellidos.trim(),
      email: data.email.trim(),
      telefono: data.telefono?.trim() || undefined,
    },
  });
  await alumnos.recargar();
  return aStudent(perfil);
}

/** Sube (o quita, con null) la foto de perfil del alumno autenticado. */
export async function actualizarFotoPerfil(foto: File | null): Promise<void> {
  if (foto) {
    const formData = new FormData();
    formData.append("foto", foto);
    await api("/me/perfil/foto", { method: "PUT", body: formData });
  } else {
    await api("/me/perfil/foto", { method: "DELETE" });
  }
  await alumnos.recargar();
}

/**
 * US-04: da de baja a un alumno. El backend no borra el registro: lo deja
 * inactivo para conservar su historial de asistencias y pagos.
 */
export async function eliminarAlumno(id: string): Promise<void> {
  await api(`/alumnos/${id}`, { method: "DELETE" });
  alumnos.establecer(
    obtenerAlumnos().map((alumno) => (alumno.id === id ? { ...alumno, estado: "inactivo" } : alumno)),
  );
}

/** US-05: busca por texto (nombres, apellidos, DNI o código) y filtra por categoría/estado. */
export function filtrarAlumnos(
  alumnos: Student[],
  opciones: {
    texto?: string;
    categoria?: string;
    estado?: Student["estado"] | "todos";
  },
): Student[] {
  const texto = opciones.texto?.trim().toLowerCase() ?? "";
  const categoria = opciones.categoria ?? "todas";
  const estado = opciones.estado ?? "todos";

  return alumnos.filter((a) => {
    if (!isStudent(a)) return false;

    const coincideTexto =
      texto === "" ||
      a.nombres.toLowerCase().includes(texto) ||
      a.apellidos.toLowerCase().includes(texto) ||
      a.dni.includes(texto) ||
      a.codigo.toLowerCase().includes(texto);

    const coincideCategoria = categoria === "todas" || a.categoria === categoria;
    const coincideEstado = estado === "todos" || a.estado === estado;

    return coincideTexto && coincideCategoria && coincideEstado;
  });
}
