import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario } from '../../services/admin.service';

@Component({
  selector: 'app-barberos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barberos.component.html',
  styleUrls: ['./barberos.component.css']
})
export class BarberosComponent implements OnInit {

  barberos: Usuario[] = [];
  cargando = true;

  roles = ['cliente', 'barbero', 'admin', 'superadmin'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarBarberos();
  }

  async cargarBarberos() {
  this.cargando = true;

  try {
    const usuarios = await this.adminService.getAllUsers();
    console.log('🔥 USUARIOS DESDE FIRESTORE:', usuarios);
    console.log('📊 Total usuarios:', usuarios?.length);

    // 🔹 Revisa TODOS los roles que llegan
    usuarios.forEach(u => {
      console.log(`Usuario: ${u.nombre} | Rol: "${u.rol}" | Tipo: ${typeof u.rol}`);
    });

    // 🔹 Filtramos todo lo que tenga "barb" en el rol
    this.barberos = usuarios.filter(u => {
      const rol = String(u.rol || '').toLowerCase().trim();
      console.log(`🔍 Filtrando: "${u.nombre}" con rol "${rol}" | Incluye "barb"? ${rol.includes('barb')}`);
      return rol.includes('barb');
    });

    console.log('✂️ BARBEROS FILTRADOS:', this.barberos);
    console.log('📊 Total barberos:', this.barberos.length);

  } catch (error) {
    console.error('❌ ERROR al cargar barberos:', error);
  } finally {
    this.cargando = false;
  }
}

  async cambiarRol(u: Usuario, nuevoRol: string) {
    await this.adminService.updateUserRole(u.uid, nuevoRol);
    await this.cargarBarberos();
  }

  async eliminar(u: Usuario) {
    const confirmar = confirm(`¿Eliminar barbero ${u.nombre}?`);
    if (!confirmar) return;

    await this.adminService.deleteUser(u.uid);
    await this.cargarBarberos();
  }
}
