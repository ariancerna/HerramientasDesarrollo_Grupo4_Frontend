export type EstadoPago = "pagado" | "pendiente" | "vencido";

export interface PagoMensualidad {
  id: string;
  estudianteId: string;
  periodo: string;
  concepto: string;
  monto: number;
  moneda: "PEN";
  vencimiento: string;
  estado: EstadoPago;
  fechaPago?: string;
  metodoPago?: "Yape" | "Plin" | "Transferencia" | "Efectivo";
  codigoOperacion?: string;
}
