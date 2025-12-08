import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { onAuthStateChanged } from '@firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

export type UserRole = 'cliente' | 'barbero' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // 🟣 NUEVO: rol del usuario
  private currentUserRoleSubject = new BehaviorSubject<UserRole | null>(null);
  public currentUserRole$: Observable<UserRole | null> = this.currentUserRoleSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Mantener el estado del usuario en tiempo real
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user || null);

      if (user) {
        // Cargar rol desde Firestore
        this.loadUserRole(user.uid);
      } else {
        this.currentUserRoleSubject.next(null);
      }
    });
  }

  // Registro en Firebase Auth
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // 🟣 NUEVO: crear documento en colección "usuarios"
  createUserDocument(user: User, nombre: string, rol: UserRole = 'cliente') {
    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    return setDoc(userRef, {
      nombre,
      email: user.email,
      rol
    });
  }

  // Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Obtener usuario actual (objeto de Auth)
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // 🟣 NUEVO: cargar el rol desde Firestore
  loadUserRole(uid: string) {
    const userRef = doc(this.firestore, `usuarios/${uid}`);

    return docData(userRef).pipe(take(1)).subscribe({
      next: (data: any) => {
        const rol: UserRole | null = data?.rol ?? null;
        this.currentUserRoleSubject.next(rol);
      },
      error: () => {
        this.currentUserRoleSubject.next(null);
      }
    });
  }
}
