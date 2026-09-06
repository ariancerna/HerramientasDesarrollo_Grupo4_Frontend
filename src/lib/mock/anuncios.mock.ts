import { Anuncio } from "@/types/anuncio";

export const MOCK_ANUNCIOS: Anuncio[] = [
  {
    id: "anuncio-001",
    profesorId: "u-002",
    titulo: "Cambio de horario del entrenamiento",
    mensaje: "El entrenamiento del viernes se realizará a las 17:00 en la cancha principal.",
    fechaCreacion: "2026-09-02T10:30:00.000Z",
    destinatarios: ["alu-001", "alu-002", "alu-003", "alu-004", "alu-005"],
    estado: "enviado",
  },
  {
    id: "anuncio-002",
    profesorId: "u-002",
    titulo: "Reunión pendiente",
    mensaje: "Recordatorio: preparar los objetivos individuales para la próxima evaluación.",
    fechaCreacion: "2026-09-04T15:00:00.000Z",
    destinatarios: ["alu-005"],
    categoriaId: "cat-sub12",
    estado: "borrador",
  },
];