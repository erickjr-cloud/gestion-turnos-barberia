import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Turno } from '../../interfaces/turno.interface';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-create-turno',
  standalone: true,
  imports: [
    CommonModule,        // 🟣 NECESARIO para *ngIf, *ngFor
    ReactiveFormsModule
  ],
  templateUrl: './create-turno.component.html',
  styleUrls: ['./create-turno.component.css']
})
export class CreateTurnoComponent implements OnInit {

  turnoForm: FormGroup;
  loading = false;
  errorMessage = '';
  titulo = 'Crear Turno';

  modoEdicion = false;
  turnoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private turnosService: TurnosService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.turnoForm = this.fb.group({
      cliente: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      servicio: ['', Validators.required],
      notas: [''],
      estado: ['pendiente']
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) {
            this.modoEdicion = false;
            this.titulo = 'Crear Turno';
            return of(null);
          }

          this.modoEdicion = true;
          this.titulo = 'Editar Turno';
          this.turnoId = id;

          return this.turnosService.getTurnoById(id);
        })
      )
      .subscribe((turno) => {
        if (!turno) return;

        this.turnoForm.patchValue({
          cliente: turno.cliente,
          fecha: turno.fecha,
          hora: turno.hora,
          servicio: turno.servicio,
          notas: turno.notas ?? '',
          estado: turno.estado ?? 'pendiente'
        });
      });
  }

  onSubmit() {
    if (this.turnoForm.invalid) {
      this.errorMessage = 'Completa todos los campos obligatorios.';
      this.turnoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // MODO EDITAR
    if (this.modoEdicion && this.turnoId) {
      this.turnosService.updateTurno(this.turnoId, this.turnoForm.value)
        .then(() => {
          alert('Turno actualizado correctamente');
          this.router.navigate(['/turnos/list']);
        })
        .catch(err => {
          console.error(err);
          this.errorMessage = 'Ocurrió un error al actualizar el turno.';
        })
        .finally(() => this.loading = false);

      return;
    }

    // MODO CREAR
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'No hay usuario autenticado.';
      this.loading = false;
      return;
    }

    const nuevoTurno: Turno = {
      ...this.turnoForm.value,
      creadoPor: user.uid
    };

    this.turnosService.createTurno(nuevoTurno)
      .then(() => {
        alert('Turno creado correctamente');
        this.turnoForm.reset();
        this.router.navigate(['/turnos/list']);
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = 'Ocurrió un error al guardar el turno.';
      })
      .finally(() => this.loading = false);
  }
}
