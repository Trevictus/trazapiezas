import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FormsModule } from '@angular/forms';
import { PartsService } from '../../services/parts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './parts-list.html',
  styleUrl: './parts-list.scss'
})
export class PartsListComponent implements OnInit {
  // 1. Definimos la variable que el HTML estaba buscando
  parts: any[] = []; 
  searchTerm: string = '';

  constructor(private partsService: PartsService, private cdr: ChangeDetectorRef, public router: Router) {}

  ngOnInit(): void {
    // 2. Al cargar la página, pedimos las piezas al backend
    this.loadParts();
  }

  loadParts(): void {
    this.partsService.getParts().subscribe({
      next: (data) => {
        this.parts = data; // Guardamos las piezas reales de PostgreSQL
        console.log('Piezas cargadas de Cazapiezas:', data);
        this.cdr.detectChanges(); // Forzamos a Angular a actualizar la vista
      },
      error: (err) => {
        console.error('Error al traer el inventario:', err);
      }
    });
  }

  get filteredParts() {
    return this.parts.filter(part => 
      part.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      part.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      part.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  adjustStock(part: any, amount: number): void {
    const newStock = part.stock + amount;
    if (newStock < 0) return;

    // Creamos una copia de la pieza con el stock nuevo
    const updatedPart = { ...part, stock: newStock };

    this.partsService.updatePart(part.id, updatedPart).subscribe({
      next: () => {
        part.stock = newStock;
        this.cdr.detectChanges();
        console.log('Servidor actualizó correctamente');
      },
      error: (err) => console.error('El servidor rechazó el cambio:', err)
    });
  }

  deletePart(part: any): void {
    const confirmacion = confirm(`¿Estás seguro de eliminar ${part.brand}?`);
    
    if (confirmacion) {
      this.partsService.deletePart(part.id).subscribe({
        next: () => {
          // 1. CREAMOS UN NUEVO ARRAY: 
          // Filtramos y envolvemos para que Angular detecte el cambio de referencia
          this.parts = [...this.parts.filter(p => p.id !== part.id)];
          
          console.log('✅ Pieza borrada y array local actualizado');

          // 2. FORZAMOS EL REDIBUJADO:
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ El servidor no pudo borrar la pieza:', err);
          alert('Error al eliminar: Verifica que la pieza no tenga dependencias.');
        }
      });
    }
  }
}