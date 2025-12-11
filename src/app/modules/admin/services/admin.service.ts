import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  getDocs  // 👈 NUEVO
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

  // ✅ Obtener todos los usuarios (CORREGIDO)
  async getAllUsers(): Promise<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    const snapshot = await getDocs(ref);
    
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      nombre: doc.data()['nombre'] || '',
      email: doc.data()['email'] || '',
      rol: doc.data()['rol'] || ''
    })) as Usuario[];
  }

  // Cambiar rol
  async updateUserRole(uid: string, nuevoRol: string): Promise<void> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    await updateDoc(ref, { rol: nuevoRol });
  }

  // Eliminar usuario
  async deleteUser(uid: string): Promise<void> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    await deleteDoc(ref);
  }
}