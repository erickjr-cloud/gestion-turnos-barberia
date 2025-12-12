export interface Solicitud {
  id?: string;

  clienteUid: string;
  clienteNombre: string;

  fechaDeseada: string; // yyyy-mm-dd
  horaDeseada: string;  // HH:mm
  servicio: string;
  notas?: string;

  estado: 'pendiente' | 'aceptada' | 'rechazada';

  createdAt: any; // Timestamp o Date
}
