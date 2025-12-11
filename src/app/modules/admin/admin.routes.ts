import { Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { BarberosComponent } from './pages/barberos/barberos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminHomeComponent
  },
  {
    path: 'barberos',
    component: BarberosComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  }
];
