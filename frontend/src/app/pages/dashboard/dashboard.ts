import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PartsService } from '../../services/parts';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  stats = { 
    totalParts: 0, 
    lowStock: 0, 
    movementsToday: 0 
  };

  constructor(
    private partsService: PartsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.partsService.getStats().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servidor:', data);
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
      }
    });
  }

  goToInventory() {
    this.router.navigate(['/inventory']);
  }
}