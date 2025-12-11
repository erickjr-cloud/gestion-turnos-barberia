import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { clientGuard } from './core/guards/client.guard';
import { barberGuard } from './core/guards/barber.guard';
import { adminGuard } from './core/guards/admin.guard';
import { superAdminGuard } from './core/guards/superadmin.guard';

// 🔥 IMPORTAR EL COMPONENTE 404
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [

  // 🔐 AUTENTICACIÓN
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // 🟦 CLIENTE — SOLO ve sus turnos
  {
    path: 'mis-turnos',
    canActivate: [authGuard, clientGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES_CLIENTE)
  },

  // 🟪 BARBERO — Gestión profesional de turnos
  {
    path: 'turnos',
    canActivate: [authGuard, barberGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES_BARBERO)
  },

  // 🟥 ADMINISTRADOR
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // 🟧 SUPERADMIN
  {
    path: 'superadmin',
    canActivate: [authGuard, superAdminGuard],
    loadChildren: () =>
      import('./modules/superadmin/superadmin.routes').then(m => m.SUPERADMIN_ROUTES)
  },

  // ROOT
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  // 🔥 GLOBAL 404 — Muestra una página, NO te manda al login
  { path: '**', component: NotFoundComponent }
];
