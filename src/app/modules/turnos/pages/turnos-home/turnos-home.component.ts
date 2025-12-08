import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';   // ← IMPORTANTE

@Component({
  selector: 'app-turnos-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule      // ← NECESARIO para routerLink y router-outlet
  ],
  templateUrl: './turnos-home.component.html',
  styleUrls: ['./turnos-home.component.css']
})
export class TurnosHomeComponent {}
