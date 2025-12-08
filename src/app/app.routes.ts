import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { clientGuard } from './core/guards/client.guard';
import { barberGuard } from './core/guards/barber.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // 🔵 RUTAS DE AUTENTICACIÓN
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // 🟢 CLIENTE — VE SUS PROPIOS TURNOS
  {
    path: 'mis-turnos',
    canActivate: [authGuard, clientGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES)
  },

  // 🟦 BARBERO — VE TODOS LOS TURNOS PROFESIONALES
  {
    path: 'turnos',
    canActivate: [authGuard, barberGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES)
  },

  // 🔴 ADMINISTRADOR — PANEL COMPLETO
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES)
  },

  // RUTA POR DEFECTO
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  // TODO LO DEMÁS → LOGIN
  {
    path: '**',
    redirectTo: 'auth'
  }
];
