import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../interfaces/turno.interface';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { EstadoPipe } from '../../pipes/estado.pipe'; // 👈 NUEVO IMPORT

@Component({
  selector: 'app-turnos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EstadoPipe], // 👈 AGREGADO AQUÍ
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.css']
})
export class TurnosListComponent implements OnInit {

  turnos$!: Observable<Turno[]>;
  turnosFiltrados$!: Observable<Turno[]>;

  filtroServicio: string = '';
  filtroFecha: string = '';

  // 🔥 NUEVO: controles de ordenamiento
  criterioOrden: 'fecha' | 'hora' | 'cliente' | 'servicio' | 'estado' = 'fecha';
  direccionOrden: 'asc' | 'desc' = 'asc';

  role$!: Observable<any>;
  uid: string | null = null;

  // ← Rol actual (para reglas especiales del cliente)
  rolActual: string | null = null;

  constructor(
    private turnosService: TurnosService,
    private authService: AuthService,
    private router: Router
  ) {
    this.role$ = this.authService.currentUserRole$;

    this.role$.subscribe(r => this.rolActual = r);

    this.authService.currentUser$.subscribe(user => {
      this.uid = user?.uid ?? null;
    });
  }

  ngOnInit(): void {

    this.turnos$ = this.turnosService.getTurnos();

    this.turnosFiltrados$ = combineLatest([
      this.turnos$,
      this.createInputStream(() => this.filtroServicio),
      this.createInputStream(() => this.filtroFecha),
      this.createInputStream(() => this.criterioOrden),
      this.createInputStream(() => this.direccionOrden),
    ]).pipe(
      map(([turnos, servicio, fecha, criterioOrden, direccionOrden]) => {

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // =========================
        // 1️⃣ FILTROS + REGLA CLIENTE
        // =========================
        let filtrados = turnos.filter(t => {

          const fechaTurno = new Date(t.fecha + 'T' + t.hora);
          fechaTurno.setHours(0, 0, 0, 0);

          // 🔒 REGLA ESPECIAL PARA CLIENTE:
          if (this.rolActual === 'cliente') {

            // No mostrar turnos PASADOS
            if (fechaTurno < hoy) return false;

            // No mostrar cancelados ni completados
            if (t.estado === 'cancelado' || t.estado === 'completado') {
              return false;
            }
          }

          const coincideServicio =
            servicio.trim() === '' ||
            t.servicio.toLowerCase().includes(servicio.toLowerCase());

          const coincideFecha =
            fecha.trim() === '' ||
            t.fecha === fecha;

          return coincideServicio && coincideFecha;
        });

        // =========================
        // 2️⃣ ORDENAMIENTO
        // =========================
        filtrados = [...filtrados].sort((a, b) => {
          let aVal: string = '';
          let bVal: string = '';

          switch (criterioOrden) {
            case 'fecha':
              aVal = a.fecha;
              bVal = b.fecha;
              break;
            case 'hora':
              aVal = a.hora;
              bVal = b.hora;
              break;
            case 'cliente':
              aVal = (a.cliente || '').toLowerCase();
              bVal = (b.cliente || '').toLowerCase();
              break;
            case 'servicio':
              aVal = (a.servicio || '').toLowerCase();
              bVal = (b.servicio || '').toLowerCase();
              break;
            case 'estado':
              aVal = (a.estado || '').toLowerCase();
              bVal = (b.estado || '').toLowerCase();
              break;
          }

          if (aVal < bVal) return -1;
          if (aVal > bVal) return 1;
          return 0;
        });

        if (direccionOrden === 'desc') {
          filtrados = filtrados.reverse();
        }

        return filtrados;
      })
    );
  }

  // ⚠️ Tu truco para "escuchar" cambios de inputs cada 200 ms
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
      .catch(err => console.error(err));
  }

  confirmarTurno(turno: Turno) {
    if (!turno.id) return;
    this.turnosService.confirmarTurno(turno.id);
  }

  completarTurno(turno: Turno) {
    if (!turno.id) return;
    this.turnosService.completarTurno(turno.id);
  }

  cancelarTurnoCliente(turno: Turno) {
    if (!turno.id) return;

    if (turno.creadoPor !== this.uid) {
      alert('Solo puedes cancelar tus propios turnos.');
      return;
    }

    const ok = confirm('¿Seguro que deseas cancelar tu turno?');
    if (!ok) return;

    this.turnosService.cancelarTurno(turno.id);
  }

}