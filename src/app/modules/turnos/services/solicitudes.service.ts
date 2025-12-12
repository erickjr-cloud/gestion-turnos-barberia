import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Solicitud } from '../interfaces/solicitud.interface';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {

  private col;

  constructor(private firestore: Firestore) {
    this.col = collection(this.firestore, 'solicitudes');
  }

  crearSolicitud(data: Omit<Solicitud, 'id' | 'estado' | 'createdAt'>) {
    return addDoc(this.col, {
      ...data,
      estado: 'pendiente',
      createdAt: new Date()
    });
  }

  // Admin/Barbero: ver todas
  getSolicitudes(): Observable<Solicitud[]> {
    return collectionData(this.col, { idField: 'id' }) as Observable<Solicitud[]>;
  }

  // Cliente: ver solo las suyas
  getMisSolicitudes(uid: string): Observable<Solicitud[]> {
    const q = query(this.col, where('clienteUid', '==', uid), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Solicitud[]>;
  }

  aceptarSolicitud(id: string) {
    return updateDoc(doc(this.firestore, `solicitudes/${id}`), { estado: 'aceptada' });
  }

  rechazarSolicitud(id: string) {
    return updateDoc(doc(this.firestore, `solicitudes/${id}`), { estado: 'rechazada' });
  }
}
