import { Routes } from '@angular/router';
import { TurnosHomeComponent } from './pages/turnos-home/turnos-home.component';
import { CreateTurnoComponent } from './pages/create-turno/create-turno.component';

export const TURNOS_ROUTES: Routes = [
  {
    path: '',
    component: TurnosHomeComponent
  },
  {
    path: 'crear',
    component: CreateTurnoComponent
  }
];
