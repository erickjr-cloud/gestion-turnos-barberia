import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Turno } from '../../interfaces/turno.interface';

@Component({
  selector: 'app-create-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-turno.component.html',
  styleUrls: ['./create-turno.component.css']
})
export class CreateTurnoComponent {

  turnoForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private turnosService: TurnosService,
    private authService: AuthService,
    private router: Router
  ) {
    this.turnoForm = this.fb.group({
      cliente: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      servicio: ['', Validators.required],
      notas: ['']
    });
  }

  onSubmit() {
    if (this.turnoForm.invalid) {
      this.errorMessage = 'Completa todos los campos obligatorios.';
      this.turnoForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'No hay usuario autenticado.';
      return;
    }

    const nuevoTurno: Turno = {
      ...this.turnoForm.value,
      estado: 'pendiente',
      creadoPor: user.uid
    };

    this.loading = true;
    this.errorMessage = '';

    this.turnosService.createTurno(nuevoTurno)
      .then(() => {
        this.loading = false;
        this.turnoForm.reset();
        // Por ahora, volvemos al home de turnos
        this.router.navigate(['/turnos']);
      })
      .catch(err => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Ocurrió un error al guardar el turno.';
      });
  }
}
