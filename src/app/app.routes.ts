import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'turnos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/turnos/turnos.routes').then(m => m.TURNOS_ROUTES)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
