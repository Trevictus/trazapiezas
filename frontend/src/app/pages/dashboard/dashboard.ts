import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PartsService } from '../../services/parts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent],
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
    this.partsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando stats', err)
    });
  }

  goToInventory() {
    this.router.navigate(['/inventory']);
  }
}