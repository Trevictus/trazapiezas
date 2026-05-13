import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';

interface User {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
}

interface EditingPassword {
  userId: number | null;
  newPassword: string;
}

interface DeletingUser {
  userId: number | null;
  confirming: boolean;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.html',
  styleUrls: ['./staff-management.scss']
})
export class StaffManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  editingPassword: EditingPassword = { userId: null, newPassword: '' };
  deletingUser: DeletingUser = { userId: null, confirming: false };
  currentUserId: number | null = null;
  activeFilter: 'TODOS' | 'ADMINS' | 'MECÁNICOS' | 'BAJA' = 'TODOS';

  newUser = {
    username: '',
    password: '',
    role: 'MECHANIC'
  };

  constructor(
    public router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  get filteredUsers(): User[] {
    if (this.activeFilter === 'BAJA') {
      return this.users.filter(u => u.isActive === false);
    }

    if (this.activeFilter === 'TODOS') {
      return this.users.filter(u => u.isActive === true);
    }

    if (this.activeFilter === 'MECÁNICOS') {
      return this.users.filter(u => u.isActive === true && u.role === 'MECHANIC');
    }

    if (this.activeFilter === 'ADMINS') {
      return this.users.filter(u => u.isActive === true && u.role === 'ADMIN');
    }

    return this.users.filter(u => u.isActive === true);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id || null;
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (res) => {
        this.users = res.users;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showToast(err.error?.message || 'Error al cargar usuarios', 'error');
        this.loading = false;
      }
    });
  }

  createUser(): void {
    if (!this.newUser.username || !this.newUser.password) {
      this.toastService.showToast('Completa todos los campos', 'error');
      return;
    }

    this.authService.registerUser(this.newUser.username, this.newUser.password, this.newUser.role).subscribe({
      next: () => {
        this.toastService.showToast('Operario creado correctamente', 'success');
        this.newUser = { username: '', password: '', role: 'MECHANIC' };
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.showToast(err.error?.message || 'Error al crear operario', 'error');
      }
    });
  }

  startEditPassword(userId: number): void {
    this.editingPassword = { userId, newPassword: '' };
  }

  cancelEditPassword(): void {
    this.editingPassword = { userId: null, newPassword: '' };
  }

  updatePassword(): void {
    if (!this.editingPassword.newPassword) {
      this.toastService.showToast('Ingresa una contraseña', 'error');
      return;
    }

    if (this.editingPassword.userId !== null) {
      this.authService.updateUserPassword(this.editingPassword.userId, this.editingPassword.newPassword).subscribe({
        next: () => {
          this.editingPassword = { userId: null, newPassword: '' };
          this.cdr.detectChanges();
          this.toastService.showToast('Contraseña actualizada', 'success');
        },
        error: (err) => {
          this.editingPassword = { userId: null, newPassword: '' };
          this.cdr.detectChanges();
          this.toastService.showToast(err.error?.message || 'Error al actualizar contraseña', 'error');
        }
      });
    }
  }

  startDeleteUser(userId: number): void {
    this.deletingUser = { userId, confirming: true };
  }

  cancelDeleteUser(): void {
    this.deletingUser = { userId: null, confirming: false };
  }

  confirmDeleteUser(): void {
    if (this.deletingUser.userId !== null) {
      this.authService.deleteUser(this.deletingUser.userId).subscribe({
        next: () => {
          this.toastService.showToast('Operario eliminado', 'success');
          this.deletingUser = { userId: null, confirming: false };
          this.loadUsers();
        },
        error: (err) => {
          this.toastService.showToast(err.error?.message || 'Error al eliminar operario', 'error');
          this.deletingUser = { userId: null, confirming: false };
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleStatus(userId: number): void {
    this.authService.toggleUserStatus(userId).subscribe({
      next: (res) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.isActive = res.isActive;
          this.cdr.detectChanges();
          this.toastService.showToast(`Estado actualizado`, 'success');
        }
      },
      error: (err) => {
        this.toastService.showToast(err.error?.message || 'Error al cambiar estado', 'error');
      }
    });
  }

  getStatusButtonStyle(isActive: boolean): { [key: string]: string } {
    return {
      'background-color': isActive ? '#d96a11' : '#10b967',
      'border-color': isActive ? '#c85a0a' : '#0a9653'
    };
  }
}
