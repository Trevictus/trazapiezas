import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation';
import { VehicleService, Vehicle } from '../../services/vehicle';
import { PartsService } from '../../services/parts';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register-movement',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent],
  templateUrl: './register-movement.html'
})
export class RegisterMovementComponent implements OnInit {
  movementId: string = 'TRX' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  currentUser: any = null;
  part: any = null;
  plate: string = '';
  
  vehicleData: Vehicle | null = null;
  showNotFoundWarning: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private partsService: PartsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const partId = this.route.snapshot.params['id'];
    this.partsService.getPartById(partId).subscribe(p => this.part = p);
  }

  searchPlate(): void {
    this.showNotFoundWarning = false;
    this.vehicleData = null;

    this.vehicleService.checkVehicleInTallerGP(this.plate).subscribe({
      next: (data: Vehicle) => this.vehicleData = data,
      error: () => this.showNotFoundWarning = true
    });
  }

  quickRegister(): void {
    this.vehicleService.registerQuickVehicle(this.plate).subscribe((newV: Vehicle) => {
      this.vehicleData = newV;
      this.showNotFoundWarning = false;
    });
  }

  confirmMovement(): void {
    if (!this.vehicleData) return;
    const payload = {
      partId: this.part.id,
      quantity: 1, // Simplificado: siempre 1 unidad por movimiento
      vehiclePlate: this.plate.toUpperCase(),
      status: 'USED',
      userId: this.currentUser?.id
    };
    this.partsService.createMovement(payload).subscribe(() => this.router.navigate(['/dashboard']));
  }
}