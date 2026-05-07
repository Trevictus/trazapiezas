import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NavigationComponent } from '../../components/navigation/navigation';
import { ToastService } from '../../services/toast';

interface User {
  id: number;
  username: string;
  role: string;
}

interface EditingPassword {
  userId: number | null;
  newPassword: string;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent],
  templateUrl: './staff-management.html',
  styleUrls: ['./staff-management.scss']
})
export class StaffManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  editingPassword: EditingPassword = { userId: null, newPassword: '' };

  newUser = {
    username: '',
    password: '',
    role: 'MECHANIC'
  };

  constructor(
    public router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.users;
        this.loading = false;
      },
      error: () => {
        this.toastService.showToast('Error al cargar usuarios', 'error');
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
          this.toastService.showToast('Contraseña actualizada', 'success');
          this.editingPassword = { userId: null, newPassword: '' };
        },
        error: () => {
          this.toastService.showToast('Error al actualizar contraseña', 'error');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
