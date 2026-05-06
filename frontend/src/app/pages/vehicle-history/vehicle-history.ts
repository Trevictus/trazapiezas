import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation';
import { PartsService } from '../../services/parts';

@Component({
  selector: 'app-vehicle-history',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NavigationComponent
  ],
  templateUrl: './vehicle-history.html',
  styleUrl: './vehicle-history.scss'
})
export class VehicleHistoryComponent implements OnInit {
  plate: string = '';
  movements: any[] = [];
  searched: boolean = false;

  constructor(
    private partsService: PartsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Escucha si venimos del Dashboard con una matrícula en la URL
    this.route.queryParams.subscribe(params => {
      if (params['plate']) {
        this.plate = params['plate'];
        this.search();
      }
    });
  }

  search(): void {
    if (!this.plate.trim()) return;
    
    const cleanPlate = this.plate.trim().toUpperCase();

    this.partsService.getMovementsByPlate(cleanPlate).subscribe({
      next: (data) => {
        this.movements = data;
        this.searched = true;
      },
      error: (err: any) => {
        console.error('Error al buscar matrícula:', err);
        this.movements = [];
        this.searched = true;
      }
    });
  }
}