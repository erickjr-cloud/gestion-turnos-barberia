import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TurnosService } from '../../services/turnos.service';
import { Observable, map } from 'rxjs';
import { Turno } from '../../interfaces/turno.interface';

@Component({
  selector: 'app-turnos-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './turnos-home.component.html',
  styleUrls: ['./turnos-home.component.css']
})
export class TurnosHomeComponent implements OnInit {

  turnos$!: Observable<Turno[]>;

  totalTurnos = 0;
  pendientes = 0;
  completados = 0;
  cancelados = 0;

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.turnos$ = this.turnosService.getTurnos();

    this.turnos$.pipe(
      map(turnos => {

        this.totalTurnos = turnos.length;

        this.pendientes = turnos.filter(t => t.estado === 'pendiente').length;
        this.completados = turnos.filter(t => t.estado === 'confirmado').length;
        this.cancelados = turnos.filter(t => t.estado === 'cancelado').length;

        return turnos;
      })
    ).subscribe();
  }
}
