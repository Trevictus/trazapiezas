import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PartsService } from '../../../services/parts';
import { WarehouseService } from '../../../services/warehouse';
import { AuthService } from '../../../services/auth';
import { Shelf } from '../../../models/shelf';

@Component({
  selector: 'app-add-part',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-part.html',
})
export class AddPartComponent implements OnInit {
  shelves: Shelf[] = [];
  userRole: string = '';

  newPart = {
    reference: '',
    brand: '',
    category: '',
    description: '',
    stock: 0,
    price: 0,
    shelfId: '',
  };

  constructor(
    private partsService: PartsService,
    private warehouseService: WarehouseService,
    public router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    if (this.userRole === 'ADMIN') {
      this.loadShelves();
    }
  }

  loadShelves() {
    this.warehouseService.getShelves().subscribe({
      next: (data) => {
        this.shelves = data;
      },
      error: (err) => {
        console.error('Error al cargar estanterías:', err);
      },
    });
  }

  onSubmit() {
    const partData = {
      ...this.newPart,
      purchasePrice: this.newPart.price,
    };

    this.partsService.createPart(partData).subscribe({
      next: () => {
        alert('Pieza registrada en el taller correctamente');
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        alert('Hubo un fallo al guardar la pieza');
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
