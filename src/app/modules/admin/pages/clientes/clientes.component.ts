import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario } from '../../services/admin.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Usuario[] = [];
  cargando = true;

  // Desde admin solo permitimos subir/bajar entre cliente y barbero
  roles = ['cliente', 'barbero'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  async cargarClientes() {
    this.cargando = true;

    const usuarios = await this.adminService.getAllUsers();
    console.log('🔥 USUARIOS (para clientes):', usuarios);

    this.clientes = usuarios.filter(u =>
      (u.rol ?? '').trim().toLowerCase() === 'cliente'
    );

    console.log('🔥 CLIENTES FILTRADOS:', this.clientes);

    this.cargando = false;
  }

  async cambiarRol(u: Usuario, nuevoRol: string) {
    if (!nuevoRol) return;

    await this.adminService.updateUserRole(u.uid, nuevoRol);
    await this.cargarClientes();
  }

  async eliminar(u: Usuario) {
    const confirmar = confirm(`¿Eliminar cliente ${u.nombre}?`);
    if (!confirmar) return;

    await this.adminService.deleteUser(u.uid);
    await this.cargarClientes();
  }
}
