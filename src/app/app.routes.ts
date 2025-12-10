import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { clientGuard } from './core/guards/client.guard';
import { barberGuard } from './core/guards/barber.guard';
import { adminGuard } from './core/guards/admin.guard';
import { superAdminGuard } from './core/guards/superadmin.guard';

export const routes: Routes = [

  // LOGIN / REGISTER
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // CLIENTE
  {
    path: 'mis-turnos',
    canActivate: [authGuard, clientGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES)
  },

  // BARBERO
  {
    path: 'turnos',
    canActivate: [authGuard, barberGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES)
  },

  // ADMINISTRADOR
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // SUPER ADMIN (si le quieres crear su propio panel)
  {
    path: 'superadmin',
    canActivate: [authGuard, superAdminGuard],
    loadChildren: () =>
      import('./modules/superadmin/superadmin.routes').then(m => m.SUPERADMIN_ROUTES)
  },

  // DEFAULT
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
