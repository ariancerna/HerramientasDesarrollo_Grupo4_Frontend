import type { Anuncio } from "@/types/anuncio";
import type { RegistroAsistencia } from "@/types/asistencia";
import type { EventoClub } from "@/types/calendario";
import type { Evaluacion } from "@/types/evaluacion";
import type { PagoMensualidad } from "@/types/pago";
import type { Student } from "@/types/student";
import type { Categoria, Horario, Profesor, Role, Sede, Usuario } from "@/types";
import { isFiniteNumber, isPlainObject, isString } from "@/lib/storage";

const ROLES: Role[] = ["administrador", "profesor", "alumno"];
const DIAS = [
  "lunes",
  "martes",
  "miercoles",
  "miércoles",
  "jueves",
  "viernes",
  "sabado",
  "sábado",
  "domingo",
];

function optionalString(value: unknown): boolean {
  return value === undefined || isString(value);
}

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function validIsoLikeDate(value: unknown): value is string {
  return isString(value) && !Number.isNaN(new Date(value).getTime());
}

export function isRole(value: unknown): value is Role {
  return isString(value) && ROLES.includes(value as Role);
}

export function isUsuario(value: unknown): value is Usuario {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.usuario) &&
    isString(value.nombre) &&
    isRole(value.rol) &&
    optionalString(value.estudianteId)
  );
}

export function isStudent(value: unknown): value is Student {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    optionalString(value.profesorId) &&
    isString(value.dni) &&
    isString(value.codigo) &&
    isString(value.nombres) &&
    isString(value.apellidos) &&
    isString(value.email) &&
    optionalString(value.telefono) &&
    optionalString(value.fotoUrl) &&
    isString(value.categoria) &&
    optionalString(value.carrera) &&
    (value.ciclo === undefined || isFiniteNumber(value.ciclo)) &&
    (value.estado === "activo" || value.estado === "inactivo")
  );
}

export function isProfesor(value: unknown): value is Profesor {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.nombre) &&
    isString(value.usuario) &&
    isString(value.password) &&
    isString(value.sedeId)
  );
}

export function isHorario(value: unknown): value is Horario {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.dia) &&
    DIAS.includes(value.dia) &&
    isString(value.horaInicio) &&
    isString(value.horaFin) &&
    optionalString(value.cancha) &&
    (value.estado === undefined || value.estado === "activo" || value.estado === "cancelado")
  );
}

export function isCategoria(value: unknown): value is Categoria {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.nombre) &&
    optionalString(value.descripcion) &&
    (value.profesorIds === undefined || stringArray(value.profesorIds)) &&
    Array.isArray(value.horarios) &&
    value.horarios.every(isHorario)
  );
}

export function isSede(value: unknown): value is Sede {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.nombre) &&
    optionalString(value.direccion)
  );
}

export function isEventoClub(value: unknown): value is EventoClub {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.titulo) &&
    isString(value.fecha) &&
    isString(value.horaInicio) &&
    optionalString(value.horaFin) &&
    isString(value.ubicacion) &&
    optionalString(value.categoria) &&
    isString(value.descripcion)
  );
}

export function isAnuncio(value: unknown): value is Anuncio {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.profesorId) &&
    isString(value.titulo) &&
    isString(value.mensaje) &&
    validIsoLikeDate(value.fechaCreacion) &&
    stringArray(value.destinatarios) &&
    optionalString(value.categoriaId) &&
    (value.estado === "borrador" || value.estado === "enviado")
  );
}

export function isEvaluacion(value: unknown): value is Evaluacion {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.alumnoId) &&
    isString(value.profesorId) &&
    isString(value.fecha) &&
    (value.rendimientoTecnico === undefined || isFiniteNumber(value.rendimientoTecnico)) &&
    (value.rendimientoFisico === undefined || isFiniteNumber(value.rendimientoFisico)) &&
    (value.actitud === undefined || isFiniteNumber(value.actitud)) &&
    isString(value.observaciones)
  );
}

export function isRegistroAsistencia(value: unknown): value is RegistroAsistencia {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.estudianteId) &&
    isString(value.dni) &&
    isString(value.estudiante) &&
    isString(value.categoria) &&
    validIsoLikeDate(value.fechaHora) &&
    (value.metodo === "ESCANEO" || value.metodo === "MANUAL")
  );
}

export function isPagoMensualidad(value: unknown): value is PagoMensualidad {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.estudianteId) &&
    isString(value.periodo) &&
    isString(value.concepto) &&
    isFiniteNumber(value.monto) &&
    value.moneda === "PEN" &&
    isString(value.vencimiento) &&
    (value.estado === "pagado" || value.estado === "pendiente" || value.estado === "vencido") &&
    optionalString(value.fechaPago) &&
    optionalString(value.metodoPago) &&
    optionalString(value.codigoOperacion)
  );
}
