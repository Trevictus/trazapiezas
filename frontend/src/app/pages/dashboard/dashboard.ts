import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from '../../components/navigation/navigation';
import { PartsService } from '../../services/parts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  stats = { totalParts: 0, lowStock: 0, movementsToday: 0 };
  plateSearch: string = '';
  recentMovements: any[] = [];

  constructor(
    private partsService: PartsService, 
    public router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.partsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      }
    });

    this.partsService.getLatestMovements().subscribe({
      next: (data) => {
        this.recentMovements = data;
        this.cdr.detectChanges();
      }
    });
  }

  searchByPlate(): void {
    if (this.plateSearch.trim()) {
      // Navegamos al historial pasando la matrícula como parámetro de consulta
      this.router.navigate(['/history'], { queryParams: { plate: this.plateSearch.toUpperCase() } });
    }
  }

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }
}