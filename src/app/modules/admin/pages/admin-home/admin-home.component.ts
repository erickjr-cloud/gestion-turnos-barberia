import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
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

  // Rol del usuario
  role$: Observable<any>;

  // Turnos en tiempo real
  turnos$!: Observable<Turno[]>;

  // Estadísticas
  totalHoy = 0;
  totalFuturos = 0;

  pendientesHoy = 0;
  confirmadosHoy = 0;
  completadosHoy = 0;
  canceladosHoy = 0;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {
    // SIEMPRE ASÍ, nunca arriba para evitar errores
    this.role$ = this.authService.currentUserRole$;
  }

  ngOnInit(): void {
    this.turnos$ = this.turnosService.getTurnos();

    this.turnos$.subscribe(turnos => {
      const hoy = this.getHoyISO();

      // ------------------------
      // 🔥 Turnos del día
      // ------------------------
      const turnosHoy = turnos.filter(t => t.fecha === hoy);

      this.totalHoy = turnosHoy.length;

      this.pendientesHoy  = turnosHoy.filter(t => t.estado === 'pendiente').length;
      this.confirmadosHoy = turnosHoy.filter(t => t.estado === 'confirmado').length;
      this.completadosHoy = turnosHoy.filter(t => t.estado === 'completado').length;
      this.canceladosHoy  = turnosHoy.filter(t => t.estado === 'cancelado').length;

      // ------------------------
      // 🔥 Turnos futuros
      // ------------------------
      this.totalFuturos = turnos.filter(t => t.fecha > hoy).length;
    });
  }

  // Fecha actual en formato YYYY-MM-DD
  private getHoyISO(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const h = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${h}`;
  }
}
