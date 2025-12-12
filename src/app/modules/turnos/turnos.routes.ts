import { Routes } from '@angular/router';

// COMPONENTES COMPARTIDOS
import { CreateTurnoComponent } from './pages/create-turno/create-turno.component';
import { TurnosListComponent } from './pages/turnos-list/turnos-list.component';
import { TurnosHomeComponent } from './pages/turnos-home/turnos-home.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';


/* ===========================================================
   🟦 RUTAS PARA CLIENTE (solo sus turnos)
=========================================================== */
export const TURNOS_ROUTES_CLIENTE: Routes = [
  {
    path: '',
    component: TurnosListComponent,  // El cliente entra directo a la lista
  },
  {
    path: 'crear',
    component: CreateTurnoComponent,
  },
  {
    path: 'editar/:id',
    component: CreateTurnoComponent,
  },
  { path: '**', redirectTo: '' }
];

/* ===========================================================
   🟪 RUTAS PARA BARBERO (gestión completa)
=========================================================== */
export const TURNOS_ROUTES_BARBERO: Routes = [
  {
    path: '',
    component: TurnosHomeComponent,
  },
  {
    path: 'list',
    component: TurnosListComponent,
  },
  {
    path: 'crear',
    component: CreateTurnoComponent,
  },
  {
    path: 'editar/:id',
    component: CreateTurnoComponent,
  },
  {
  path: 'solicitar',
  component: SolicitarTurnoComponent
  },

  { path: '**', redirectTo: '' }
];
