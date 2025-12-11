import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoColor',
  standalone: true
})
export class EstadoPipe implements PipeTransform {

  transform(estado: string): any {

    switch (estado) {

      case 'pendiente':
        return { texto: 'Pendiente ⏳', color: '#f1c40f' };

      case 'confirmado':
        return { texto: 'Confirmado ✔', color: '#3498db' };

      case 'completado':
        return { texto: 'Completado 🟢', color: '#2ecc71' };

      case 'cancelado':
        return { texto: 'Cancelado ✖', color: '#e74c3c' };

      default:
        return { texto: estado, color: '#ffffff' };
    }
  }
}
