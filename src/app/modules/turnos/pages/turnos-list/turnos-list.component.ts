import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../interfaces/turno.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-turnos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.css']
})
export class TurnosListComponent implements OnInit {

  turnos$!: Observable<Turno[]>;

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.turnos$ = this.turnosService.getTurnos();
  }
}
