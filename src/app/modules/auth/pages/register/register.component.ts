import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Solo CommonModule
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // ✅ Eliminado NgIf
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Completa todos los campos correctamente.';
      this.successMessage = '';
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.authService.register(email, password, name)
      .then(() => {
        this.errorMessage = '';
        this.successMessage = 'Cuenta creada con éxito. Redirigiendo...';

        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 1000);
      })
      .catch((err) => {
        console.error('Error al registrar:', err);
        this.successMessage = '';

        switch (err.code) {
          case 'auth/email-already-in-use':
            this.errorMessage = 'Ese correo ya está registrado.';
            break;
          case 'auth/weak-password':
            this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'El correo no tiene un formato válido.';
            break;
          default:
            this.errorMessage = 'No se pudo crear la cuenta. Intenta nuevamente.';
            break;
        }
      });
  }
}