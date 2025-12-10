import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-superadmin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './superadmin-home.component.html',
  styleUrls: ['./superadmin-home.component.css']
})
export class SuperadminHomeComponent {}
