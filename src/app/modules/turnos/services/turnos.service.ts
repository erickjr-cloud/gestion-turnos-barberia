import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Turno } from '../interfaces/turno.interface';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private turnosRef: any;

  constructor(private firestore: Firestore) {
    this.turnosRef = collection(this.firestore, 'turnos');
  }

}
