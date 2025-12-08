import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../interfaces/turno.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-turnos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.css']
})
export class TurnosListComponent implements OnInit {

  turnos$!: Observable<Turno[]>;

  constructor(
    private turnosService: TurnosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.turnos$ = this.turnosService.getTurnos();
  }

  // 🟣 FUNCIÓN PARA EDITAR
  editarTurno(turno: Turno) {
    if (!turno.id) return;             // debe venir desde Firestore
    this.router.navigate(['/turnos/editar', turno.id]);
  }

  // 🟣 FUNCIÓN PARA ELIMINAR (Estructura inicial, sin lógica)
  eliminarTurno(turno: Turno) {
    if (!turno.id) return;
    
    const confirmacion = confirm(`¿Seguro que deseas eliminar el turno de ${turno.cliente}?`);

    if (!confirmacion) return;

    // 🔥 LÓGICA REAL LA HACEMOS EN LA SIGUIENTE MICRO-TAREA
    console.log("Eliminar turno -> ID:", turno.id); 
  }
}
