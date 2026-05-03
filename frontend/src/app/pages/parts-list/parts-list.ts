import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PartsService } from '../../services/parts';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './parts-list.html',
  styleUrl: './parts-list.scss'
})
export class PartsListComponent implements OnInit {
  // 1. Definimos la variable que el HTML estaba buscando
  parts: any[] = []; 

  constructor(private partsService: PartsService, private cdr: ChangeDetectorRef) {}

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
}