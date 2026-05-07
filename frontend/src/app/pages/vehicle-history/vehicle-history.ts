import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation';
import { PartsService } from '../../services/parts';
import { AuthService } from '../../services/auth';
import { debounceTime, Subject } from 'rxjs';

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
  allMovements: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private partsService: PartsService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllMovements();

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchPlate => {
      if (searchPlate.trim()) {
        this.performSearch(searchPlate);
      } else {
        this.movements = this.allMovements;
        this.searched = false;
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['plate']) {
        this.plate = params['plate'];
        this.searchSubject.next(this.plate);
      }
    });
  }

  loadAllMovements(): void {
    this.partsService.getLatestMovements().subscribe({
      next: (data) => {
        this.allMovements = data;
        this.movements = data;
      },
      error: (err: any) => {
        console.error('Error al cargar movimientos:', err);
        this.movements = [];
      }
    });
  }

  onPlateChange(value: string): void {
    this.plate = value;
    this.searchSubject.next(value);
  }

  performSearch(searchPlate: string): void {
    const cleanPlate = searchPlate.trim().toUpperCase();

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

  search(): void {
    this.searchSubject.next(this.plate);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}