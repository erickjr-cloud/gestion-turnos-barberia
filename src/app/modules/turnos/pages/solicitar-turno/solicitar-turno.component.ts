import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudesService } from '../../services/solicitudes.service';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent {

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    fechaDeseada: ['', Validators.required],
    horaDeseada: ['', Validators.required],
    servicio: ['', Validators.required],
    notas: ['']
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private solicitudes: SolicitudesService,
    private router: Router
  ) {}

  enviar() {
    if (this.form.invalid) {
      this.errorMessage = 'Completa los campos obligatorios.';
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.getCurrentUser();
    if (!user) {
      this.errorMessage = 'No hay usuario autenticado.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.solicitudes.crearSolicitud({
      clienteUid: user.uid,
      clienteNombre: user.displayName ?? 'Cliente',
      ...(this.form.value as any)
    }).then(() => {
      alert('Solicitud enviada. El barbero la revisará.');
      this.form.reset();
      this.router.navigate(['/mis-turnos']);
    }).catch(err => {
      console.error(err);
      this.errorMessage = 'Error al enviar solicitud.';
    }).finally(() => this.loading = false);
  }
}
