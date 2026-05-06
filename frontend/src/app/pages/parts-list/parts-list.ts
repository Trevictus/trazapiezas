import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation';
import { PartsService } from '../../services/parts';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent],
  templateUrl: './parts-list.html',
  styleUrl: './parts-list.scss'
})
export class PartsListComponent implements OnInit {
  parts: any[] = [];
  searchTerm: string = '';

  constructor(
    private partsService: PartsService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadParts();
  }

  loadParts(): void {
    this.partsService.getParts().subscribe({
      next: (data) => {
        this.parts = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar piezas', err)
    });
  }

  get filteredParts() {
    return this.parts.filter(part => 
      part.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      part.reference.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  adjustStock(part: any, amount: number): void {
    const newStock = part.stock + amount;
    if (newStock < 0) return;

    const updatedPart = { ...part, stock: newStock };

    this.partsService.updatePart(part.id, updatedPart).subscribe({
      next: () => {
        part.stock = newStock;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al actualizar stock', err)
    });
  }

  deletePart(part: any): void {
    if (confirm(`¿Estás seguro de eliminar ${part.brand}?`)) {
      this.partsService.deletePart(part.id).subscribe({
        next: () => this.loadParts(),
        error: (err: any) => console.error('Error al eliminar', err)
      });
    }
  }
}