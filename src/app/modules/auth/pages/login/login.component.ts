import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UserRole } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then(() => {
        this.errorMessage = '';

        // 🟣 ESPERAR A QUE SE CARGUE EL ROL DESDE FIRESTORE
        this.authService.currentUserRole$
          .pipe(
            filter((rol: UserRole | null) => rol !== null),
            take(1)
          )
          .subscribe((rol: UserRole | null) => {
            console.log('ROL DETECTADO:', rol);

            // 🔥 AQUÍ LUEGO REDIRECCIONAMOS SEGÚN EL ROL
            // for now:
            this.router.navigate(['/turnos']);
          });

      })
      .catch((err) => {
        console.error(err);
        this.errorMessage = 'Credenciales incorrectas.';
      });
  }
}
