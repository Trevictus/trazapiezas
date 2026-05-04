import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PartsService } from '../../services/parts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  stats = { totalParts: 0, lowStock: 0, movementsToday: 0 };

  constructor(private partsService: PartsService) {}

  ngOnInit(): void {
    this.partsService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error cargando stats', err)
    });
  }
}