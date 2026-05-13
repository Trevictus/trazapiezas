import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartsService } from '../../../services/parts';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  stats = { totalParts: 0, lowStock: 0, movementsToday: 0 };
  plateSearch: string = '';
  recentMovements: any[] = [];

  constructor(
    private partsService: PartsService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

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
      this.router.navigate(['/history'], { queryParams: { plate: this.plateSearch.toUpperCase() } });
    }
  }

  goToLowStockInventory(): void {
    this.router.navigate(['/inventory'], { queryParams: { filter: 'lowstock' } });
  }

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}