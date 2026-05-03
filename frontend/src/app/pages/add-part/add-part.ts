import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PartsService } from '../../services/parts';

@Component({
  selector: 'app-add-part',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './add-part.html',
  styleUrl: './add-part.scss'
})
export class AddPartComponent {
  // Objeto con la estructura que espera tu PostgreSQL
  newPart = {
    reference: '',
    brand: '',
    category: '',
    description: '',
    stock: 0,
    price: 0
  };

  constructor(private partsService: PartsService, public router: Router) {}

  onSubmit() {
    this.partsService.createPart(this.newPart).subscribe({
      next: () => {
        alert('Pieza registrada en el taller correctamente');
        this.router.navigate(['/inventory']); // Volvemos a la lista
      },
      error: (err) => {
        console.error('Error al crear:', err);
        alert('Hubo un fallo al guardar la pieza');
      }
    });
  }
}