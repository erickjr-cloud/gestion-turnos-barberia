import { Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { BarberosComponent } from './pages/barberos/barberos.component';
import { AdminService } from './services/admin.service';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    providers: [AdminService]   // <-- ADMIN SERVICE SOLO PARA ESTE MÓDULO
  },
  {
    path: 'barberos',
    component: BarberosComponent,
    providers: [AdminService]   // <-- TAMBIÉN AQUÍ
  }
];
