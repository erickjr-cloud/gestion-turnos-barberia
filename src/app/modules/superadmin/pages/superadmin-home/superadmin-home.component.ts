import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario } from '../../services/admin.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-superadmin-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './superadmin-home.component.html',
  styleUrls: ['./superadmin-home.component.css']
})
export class SuperadminHomeComponent implements OnInit {

  cargando = true;
  usuarios: Usuario[] = [];
  roles = ['cliente', 'barbero', 'admin', 'superadmin'];

  // Datos para formulario de creación
  nuevoNombre = '';
  nuevoEmail = '';
  nuevoPassword = '';
  nuevoRol = 'cliente';

  // UID del superadmin actual (para prohibir auto-eliminarse)
  miUID: string | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.miUID = this.authService.getCurrentUser()?.uid ?? null;
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.cargando = true;
    this.usuarios = await this.adminService.getAllUsers();
    this.cargando = false;
  }

  // 🔄 Cambiar Rol
  async cambiarRol(uid: string, nuevoRol: string) {

    if (!uid) return;

    // ❌ Proteger superadmin (NO cambiar su rol)
    if (uid === this.miUID) {
      alert("No puedes cambiar tu propio rol.");
      return;
    }

    await this.adminService.updateUserRole(uid, nuevoRol);
    await this.cargarUsuarios();
  }

  // 🗑 Eliminar usuario
  async eliminar(uid: string) {

    if (!uid) return;

    // ❌ No puede borrarse a sí mismo
    if (uid === this.miUID) {
      alert("No puedes eliminar tu propia cuenta.");
      return;
    }

    const confirmar = confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmar) return;

    await this.adminService.deleteUser(uid);
    await this.cargarUsuarios();
  }

  // ➕ Crear usuario nuevo
  async crearUsuario() {
    if (!this.nuevoNombre || !this.nuevoEmail || !this.nuevoPassword) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      await this.adminService.createUser(
        this.nuevoNombre,
        this.nuevoEmail,
        this.nuevoPassword,
        this.nuevoRol
      );

      alert("Usuario creado correctamente.");

      // Reset formulario
      this.nuevoNombre = '';
      this.nuevoEmail = '';
      this.nuevoPassword = '';
      this.nuevoRol = 'cliente';

      await this.cargarUsuarios();

    } catch (e) {
      console.error(e);
      alert("Error al crear usuario.");
    }
  }
}
