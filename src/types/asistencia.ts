export type MetodoAsistencia = "ESCANEO" | "MANUAL";

export interface EstudianteAsistencia {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  categoria: string;
  activo: boolean;
}

export interface RegistroAsistencia {
  id: string;
  estudianteId: string;
  dni: string;
  estudiante: string;
  categoria: string;
  fechaHora: string;
  metodo: MetodoAsistencia;
}

export interface DatosCorreccionAsistencia {
  fechaHora: string;
  metodo: MetodoAsistencia;
}

export interface FiltrosAsistencia {
  texto?: string;
  categoria?: string;
  fecha?: string;
}
