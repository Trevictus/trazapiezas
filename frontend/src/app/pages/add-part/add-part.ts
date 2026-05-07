import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation';
import { PartsService } from '../../services/parts';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-add-part',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent],
  templateUrl: './add-part.html',
  styleUrl: './add-part.scss'
})
export class AddPartComponent {
  newPart = {
    reference: '',
    brand: '',
    category: '',
    description: '',
    stock: 0,
    price: 0
  };

  constructor(
    private partsService: PartsService, 
    public router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.partsService.createPart(this.newPart).subscribe({
      next: () => {
        alert('Pieza registrada en el taller correctamente');
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        alert('Hubo un fallo al guardar la pieza');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}