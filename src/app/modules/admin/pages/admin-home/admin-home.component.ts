import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// IMPORTS CORRECTOS
import { TurnosService } from '../../../turnos/services/turnos.service';
import { Turno } from '../../../turnos/interfaces/turno.interface';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  role$: any;
  turnos$!: Observable<Turno[]>;

  totalHoy = 0;
  totalFuturos = 0;
  estadosHoy = {
    pendientes: 0,
    confirmados: 0,
    completados: 0,
    cancelados: 0
  };

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {
    this.role$ = this.authService.currentUserRole$;
  }

  ngOnInit(): void {
    this.turnos$ = this.turnosService.getTurnos();

    this.turnos$.subscribe(turnos => {
      const hoy = this.turnosService.getTurnosHoy(turnos);
      this.totalHoy = hoy.length;

      this.estadosHoy = this.turnosService.contarEstados(hoy);

      const futuros = this.turnosService.getTurnosFuturos(turnos);
      this.totalFuturos = futuros.length;
    });
  }

}
