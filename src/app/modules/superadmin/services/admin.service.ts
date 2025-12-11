import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: Firestore) {}

  // 🔹 Obtener todos los usuarios (colección 'usuarios')
  async getAllUsers(): Promise<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    const obs = collectionData(ref, { idField: 'uid' }) as Observable<Usuario[]>;
    return await firstValueFrom(obs);
  }

  // 🔹 Cambiar el rol de un usuario
  async updateUserRole(uid: string, nuevoRol: string): Promise<void> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    await updateDoc(ref, { rol: nuevoRol });
  }

  // 🔹 Eliminar usuario de Firestore
  async deleteUser(uid: string): Promise<void> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    await deleteDoc(ref);
  }
}
