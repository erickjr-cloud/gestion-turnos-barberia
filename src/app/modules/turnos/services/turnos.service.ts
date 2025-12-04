import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/turno.interface';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private turnosRef;

  constructor(private firestore: Firestore) {
    this.turnosRef = collection(this.firestore, 'turnos'); 
  }

  // Crear un turno
  crearTurno(turno: Turno) {
    return addDoc(this.turnosRef, turno);
  }

  // Obtener todos los turnos
  obtenerTurnos(): Observable<Turno[]> {
    return collectionData(this.turnosRef, { idField: 'id' }) as Observable<Turno[]>;
  }

}
