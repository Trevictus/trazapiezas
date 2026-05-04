import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PartsService } from '../../services/parts';

@Component({
  selector: 'app-vehicle-history',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './vehicle-history.html',
  styleUrl: './vehicle-history.scss'
})
export class VehicleHistoryComponent {
  plate: string = '';
  movements: any[] = [];
  searched: boolean = false;

  constructor(private partsService: PartsService) {}

  search() {
    if (!this.plate.trim()) return;
    
    // 🚀 Limpiamos espacios y pasamos a mayúsculas antes de enviar
    const cleanPlate = this.plate.trim().toUpperCase();

    this.partsService.getMovementsByPlate(cleanPlate).subscribe({
      next: (data) => {
        this.movements = data;
        this.searched = true;
      },
      error: (err) => {
        console.error('Error al buscar matrícula:', err);
        this.movements = [];
        this.searched = true;
      }
    });
  }
}