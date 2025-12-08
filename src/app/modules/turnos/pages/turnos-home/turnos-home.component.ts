import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../interfaces/turno.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-turnos-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos-home.component.html',
  styleUrls: ['./turnos-home.component.css']
})
export class TurnosHomeComponent implements OnInit {

  turnos$!: Observable<Turno[]>;

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.turnos$ = this.turnosService.getTurnos();
  }
}
