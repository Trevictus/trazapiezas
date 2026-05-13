import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../services/vehicle';
import { PartsService } from '../../../services/parts';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Vehicle } from '../../../models/vehicle';
import { Part } from '../../../models/part';
import { User } from '../../../models/user';

@Component({
  selector: 'app-register-movement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-movement.html'
})
export class RegisterMovementComponent implements OnInit {
  movementId: string = 'TRX' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  currentUser: User | null = null;
  part: Part | null = null;
  plate: string = '';
  quantity: number = 1;

  vehicleData: Vehicle | null = null;
  showNotFoundWarning: boolean = false;
  isSearching: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private vehicleService: VehicleService,
    private partsService: PartsService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const partId = this.route.snapshot.params['id'];
    this.partsService.getPartById(partId).subscribe(p => this.part = p);
  }

  isValidPlate(): boolean {
    const plateRegex = /^[0-9]{4}\s?[A-Z]{3}$/;
    return plateRegex.test(this.plate.toUpperCase().trim());
  }

  isValidQuantity(): boolean {
    return this.quantity > 0;
  }

  isFormValid(): boolean {
    return this.isValidPlate() && this.isValidQuantity() && this.vehicleData !== null;
  }

  decrementQuantity(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  searchPlate(): void {
    if (!this.isValidPlate()) {
      this.toastService.error('Formato de matrícula inválido. Usa: 1234ABC');
      return;
    }

    this.showNotFoundWarning = false;
    this.vehicleData = null;
    this.isSearching = true;

    this.vehicleService.checkVehicleInTallerGP(this.plate).subscribe({
      next: (data: Vehicle) => {
        this.vehicleData = data;
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showNotFoundWarning = true;
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    });
  }

  quickRegister(): void {
    this.vehicleService.registerQuickVehicle(this.plate).subscribe({
      next: (newV: Vehicle) => {
        this.vehicleData = newV;
        this.showNotFoundWarning = false;
        this.toastService.success('Vehículo registrado correctamente');
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Error al registrar vehículo');
        this.cdr.detectChanges();
      }
    });
  }

  confirmMovement(): void {
    if (!this.isFormValid()) {
      this.toastService.error('Por favor completa todos los campos correctamente');
      return;
    }
    if (!this.part) return

    const payload = {
      partId: this.part.id,
      quantity: this.quantity,
      vehiclePlate: this.plate.toUpperCase(),
      status: 'USED',
      userId: this.currentUser?.id,
      vin: this.vehicleData?.vin || null,
      engineCode: this.vehicleData?.engineCode || null
    } as const;

    this.partsService.createMovement(payload).subscribe({
      next: () => {
        this.toastService.success('Movimiento registrado correctamente');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Error al registrar el movimiento');
      }
    });
  }
}