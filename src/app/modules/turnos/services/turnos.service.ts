import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
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

  // Obtener todos los turnos
  getTurnos(): Observable<Turno[]> {
    return collectionData(this.turnosCollection, {
      idField: 'id'
    }) as Observable<Turno[]>;
  }

  // Crear un turno
  createTurno(turno: Turno) {
    const { id, ...data } = turno;
    return addDoc(this.turnosCollection, data);
  }

  // Actualizar
  updateTurno(id: string, cambios: Partial<Turno>) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoRef, cambios as any);
  }

  // Eliminar
  deleteTurno(id: string) {
    const turnoRef = doc(this.firestore, `turnos/${id}`);
    return deleteDoc(turnoRef);
  }
}
