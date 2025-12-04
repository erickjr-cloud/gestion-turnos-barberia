import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-turno.component.html',
  styleUrls: ['./create-turno.component.css']
})
export class CreateTurnoComponent {

  turnoForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
      console.log('Formulario incompleto');
      return;
    }

    console.log('Turno listo para guardar:', this.turnoForm.value);
  }
}
