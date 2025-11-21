import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "gestion-turnos-barberia", appId: "1:988575885616:web:ac55714a227425dfcc40f5", storageBucket: "gestion-turnos-barberia.firebasestorage.app", apiKey: "AIzaSyArTg6WCyUwEf-bAJxZKsvhhGORdaTH15o", authDomain: "gestion-turnos-barberia.firebaseapp.com", messagingSenderId: "988575885616", projectNumber: "988575885616", version: "2" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
