import { Routes } from '@angular/router';
import { TurnosHomeComponent } from './pages/turnos-home/turnos-home.component';
import { TurnosListComponent } from './pages/turnos-list/turnos-list.component';
import { CreateTurnoComponent } from './pages/create-turno/create-turno.component';

export const TURNOS_ROUTES: Routes = [
  {
    path: '',
    component: TurnosHomeComponent
  },
  {
    path: 'list',
    component: TurnosListComponent   // 👈 NUEVA pantalla de lista
  },
  {
    path: 'crear',
    component: CreateTurnoComponent  // 👈 más adelante la implementamos
  }
];
