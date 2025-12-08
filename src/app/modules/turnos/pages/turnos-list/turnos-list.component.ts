import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🟣 IMPORTANTE
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../interfaces/turno.interface';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-turnos-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // 🟣 AÑADIDO
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.css']
})
export class TurnosListComponent implements OnInit {

  turnos$!: Observable<Turno[]>;

  filtroServicio: string = '';
  filtroFecha: string = '';

  turnosFiltrados$!: Observable<Turno[]>;

  constructor(
    private turnosService: TurnosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.turnos$ = this.turnosService.getTurnos();

    this.turnosFiltrados$ = combineLatest([
      this.turnos$,
      this.createInputStream(() => this.filtroServicio),
      this.createInputStream(() => this.filtroFecha),
    ]).pipe(
      map(([turnos, servicio, fecha]) => {
        return turnos.filter(t => {
          const coincideServicio =
            servicio.trim() === '' ||
            t.servicio.toLowerCase().includes(servicio.toLowerCase());

          const coincideFecha =
            fecha.trim() === '' ||
            t.fecha === fecha;

          return coincideServicio && coincideFecha;
        });
      })
    );
  }

  createInputStream(fn: () => any) {
    return new Observable(sub => {
      const interval = setInterval(() => sub.next(fn()), 200);
      return () => clearInterval(interval);
    }).pipe(startWith(fn()));
  }

  editarTurno(turno: Turno) {
    if (!turno.id) return;
    this.router.navigate(['/turnos/editar', turno.id]);
  }

  eliminarTurno(turno: Turno) {
    if (!turno.id) return;

    const confirmacion = confirm(`¿Seguro que deseas eliminar el turno de ${turno.cliente}?`);
    if (!confirmacion) return;

    this.turnosService.deleteTurno(turno.id)
      .then(() => alert(`El turno de ${turno.cliente} fue eliminado correctamente.`))
      .catch(err => {
        console.error('Error al eliminar turno:', err);
        alert('Ocurrió un error al eliminar el turno.');
      });
  }
}
