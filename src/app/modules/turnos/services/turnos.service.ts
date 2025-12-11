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

  // 👉 Obtener todos los turnos
  getTurnos(): Observable<Turno[]> {
    return collectionData(this.turnosCollection, {
      idField: 'id'
    }) as Observable<Turno[]>;
  }

  // 👉 Obtener turno por ID
  getTurnoById(id: string): Observable<Turno | null> {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return docData(turnoRef, { idField: 'id' }) as Observable<Turno | null>;
  }

  // 👉 Crear turno
  createTurno(turno: Turno) {
    const { id, ...data } = turno;
    return addDoc(this.turnosCollection, data);
  }

  // 👉 Actualizar
  updateTurno(id: string, cambios: Partial<Turno>) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoRef, cambios as any);
  }

  // 👉 Eliminar
  deleteTurno(id: string) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return deleteDoc(turnoRef);
  }

  // 👉 Confirmar / completar / cancelar
  confirmarTurno(id: string) {
    const ref = doc(this.firestore, `turnos/${id}`);
    return updateDoc(ref, { estado: 'confirmado' });
  }

  completarTurno(id: string) {
    const ref = doc(this.firestore, `turnos/${id}`);
    return updateDoc(ref, { estado: 'completado' });
  }

  cancelarTurno(id: string) {
    const ref = doc(this.firestore, `turnos/${id}`);
    return updateDoc(ref, { estado: 'cancelado' });
  }

  // ======================================
  // ⭐ FUNCIONES DE ESTADÍSTICAS
  // ======================================

  getTurnosHoy(turnos: Turno[]) {
    const hoy = new Date().toISOString().slice(0, 10);
    return turnos.filter(t => t.fecha === hoy);
  }

  getTurnosFuturos(turnos: Turno[]) {
    const hoy = new Date().toISOString().slice(0, 10);
    return turnos.filter(t => t.fecha > hoy);
  }

  contarEstados(turnos: Turno[]) {
    return {
      pendientes: turnos.filter(t => t.estado === 'pendiente').length,
      confirmados: turnos.filter(t => t.estado === 'confirmado').length,
      completados: turnos.filter(t => t.estado === 'completado').length,
      cancelados: turnos.filter(t => t.estado === 'cancelado').length,
    };
  }
}
