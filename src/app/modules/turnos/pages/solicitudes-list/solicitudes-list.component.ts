import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { SolicitudesService } from '../../services/solicitudes.service';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes-list.component.html',
  styleUrls: ['./solicitudes-list.component.css']
})
export class SolicitudesListComponent implements OnInit {

  solicitudes$!: Observable<any[]>;

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.solicitudes$ = this.solicitudesService.getSolicitudes();
  }

}
