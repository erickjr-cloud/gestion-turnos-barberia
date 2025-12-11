export interface Turno {
  id?: string;          // ID generado por Firestore
  cliente: string;      // Nombre del cliente
  fecha: string;        // Fecha en formato YYYY-MM-DD
  hora: string;         // Hora del turno
  servicio: string;     // Corte, barba, cejas, etc.
  notas?: string;       // Notas opcionales del barbero
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado'; // Estado del turno
  creadoPor: string;    // UID del barbero que creó el turno
}
