import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Usuario } from '../../services/admin.service';

@Component({
  selector: 'app-superadmin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-home.component.html',
  styleUrls: ['./superadmin-home.component.css']
})
export class SuperadminHomeComponent implements OnInit {

  cargando = true;
  usuarios: Usuario[] = [];
  roles = ['cliente', 'barbero', 'admin', 'superadmin'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.cargando = true;
    this.usuarios = await this.adminService.getAllUsers();
    this.cargando = false;
  }

  async cambiarRol(uid: string, nuevoRol: string) {
    if (!uid || !nuevoRol) return;

    await this.adminService.updateUserRole(uid, nuevoRol);
    this.cargarUsuarios();
  }

  async eliminar(uid: string) {
    const confirmar = confirm('¿Seguro que deseas eliminar este usuario?');

    if (!confirmar) return;

    await this.adminService.deleteUser(uid);
    this.cargarUsuarios();
  }
}
