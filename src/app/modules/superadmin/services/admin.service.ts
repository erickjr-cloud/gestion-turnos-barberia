import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  setDoc
} from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
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

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // 🔹 Obtener todos los usuarios
  async getAllUsers(): Promise<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    const obs = collectionData(ref, { idField: 'uid' }) as Observable<Usuario[]>;
    return await firstValueFrom(obs);
  }

  // 🔹 Cambiar rol de usuario
  async updateUserRole(uid: string, nuevoRol: string): Promise<void> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    await updateDoc(ref, { rol: nuevoRol });
  }

  // 🔹 Crear usuario desde SUPERADMIN
  async createUser(nombre: string, email: string, password: string, rol: string) {
    // Crear en Auth
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;

    // Crear documento en Firestore
    await setDoc(doc(this.firestore, `usuarios/${uid}`), {
      nombre,
      email,
      rol
    });

    return uid;
  }

  // 🔹 Eliminar usuario de Firestore
  async deleteUser(uid: string): Promise<void> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    await deleteDoc(ref);
  }
}
