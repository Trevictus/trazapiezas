import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginData = { username: '', password: '' };

  // Inyectamos el servicio y el router
  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('¡Bienvenido a Cazapiezas!', response);
        // Guardamos el token JWT para futuras peticiones
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Error en el acceso:', err);
        alert('Credenciales incorrectas para el taller.');
      }
    });
  }
}