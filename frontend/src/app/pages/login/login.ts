import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginData = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.toastService.success('Sesión iniciada correctamente');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Credenciales incorrectas para el taller');
      }
    });
  }
}