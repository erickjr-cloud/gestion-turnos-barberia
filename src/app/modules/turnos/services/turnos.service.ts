import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/turno.interface';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private turnosCollection: any;

  constructor(private firestore: Firestore) {
    this.turnosCollection = collection(this.firestore, 'turnos');
  }

  // ============================================
  // 🔹 Obtener todos los turnos (tiempo real)
  // ============================================
  getTurnos(): Observable<Turno[]> {
    return collectionData(this.turnosCollection, {
      idField: 'id'
    }) as Observable<Turno[]>;
  }

  // ============================================
  // 🔹 Obtener un turno por ID
  // ============================================
  getTurnoById(id: string): Observable<Turno | null> {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return docData(turnoRef, { idField: 'id' }) as Observable<Turno | null>;
  }

  // ============================================
  // 🔹 Crear turno
  // ============================================
  createTurno(turno: Turno) {
    const { id, ...data } = turno;
    return addDoc(this.turnosCollection, data);
  }

  // ============================================
  // 🔹 Actualizar turno
  // ============================================
  updateTurno(id: string, cambios: Partial<Turno>) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoRef, cambios as any);
  }

  // ============================================
  // 🔹 Eliminar turno
  // ============================================
  deleteTurno(id: string) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return deleteDoc(turnoRef);
  }

  // ============================================
  // 🔥 NUEVO: Acciones de BARBERO / ADMIN
  // ============================================

  // Confirmar turno
  confirmarTurno(id: string) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoRef, { estado: 'confirmado' });
  }

  // Marcar como completado
  completarTurno(id: string) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoRef, { estado: 'completado' });
  }

  // Cancelar turno
  cancelarTurno(id: string) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoRef, { estado: 'cancelado' });
  }
}
