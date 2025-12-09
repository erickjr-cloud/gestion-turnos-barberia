import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';
import { onAuthStateChanged } from '@firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';

// 🟣 TIPOS DE ROL
export type UserRole = 'cliente' | 'barbero' | 'admin' | 'superadmin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Usuario actual (Auth)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  // Rol actual del usuario (Firestore)
  private currentUserRoleSubject = new BehaviorSubject<UserRole | null>(null);
  public currentUserRole$: Observable<UserRole | null> =
    this.currentUserRoleSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Mantener sesión y rol en tiempo real
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);

      if (user) {
        this.loadUserRole(user.uid);
      } else {
        this.currentUserRoleSubject.next(null);
      }
    });
  }

  // 🔹 Cargar rol desde Firestore
  async loadUserRole(uid: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `usuarios/${uid}`);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data: any = snap.data();
        this.currentUserRoleSubject.next(data.rol as UserRole);
      } else {
        this.currentUserRoleSubject.next(null);
      }
    } catch (err) {
      console.error('Error cargando rol:', err);
      this.currentUserRoleSubject.next(null);
    }
  }

  // 🔥 REGISTRO: crea Auth + documento en "usuarios" con rol cliente
  register(email: string, password: string, nombre: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (cred) => {
        const uid = cred.user.uid;

        const userDoc = {
          nombre,
          email,
          rol: 'cliente' as UserRole
        };

        const ref = doc(this.firestore, `usuarios/${uid}`);
        await setDoc(ref, userDoc);

        this.currentUserRoleSubject.next('cliente');

        return cred;
      });
  }

  // 🔐 Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(async (cred) => {
        await this.loadUserRole(cred.user.uid);
        return cred;
      });
  }

  // 🚪 Logout
  logout() {
    this.currentUserRoleSubject.next(null);
    return signOut(this.auth);
  }

  // Usuario actual (síncrono)
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
