import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../services/turnos.service';
import { Observable } from 'rxjs';
import { Turno } from '../../interfaces/turno.interface';

@Component({
  selector: 'app-turnos-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos-home.component.html',
  styleUrls: ['./turnos-home.component.css']
})
export class TurnosHomeComponent {

  turnos$: Observable<Turno[]>;

  constructor(private turnosService: TurnosService) {
    this.turnos$ = this.turnosService.getTurnos();
  }
}
