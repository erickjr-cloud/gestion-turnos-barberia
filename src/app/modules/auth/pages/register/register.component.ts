import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    const { email, password } = this.registerForm.value;

    // 🔥 REGISTRO REAL EN FIREBASE
    this.authService.register(email, password)
      .then(() => {
        this.errorMessage = '';
        this.successMessage = 'Cuenta creada con éxito';

        // Espera 1 segundo y redirige
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = 'No se pudo crear la cuenta. Revisa el correo.';
      });
  }
}
