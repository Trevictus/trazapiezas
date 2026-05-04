import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PartsService } from '../../services/parts';

@Component({
  selector: 'app-register-movement',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './register-movement.html',
  styleUrl: './register-movement.scss'
})
export class RegisterMovementComponent implements OnInit {
  part: any = null;
  loading: boolean = true;
  movement = {
    partId: 0,
    quantity: 1,
    vehiclePlate: '',
    status: 'USED',
    purchasePrice: 0
  };

  constructor(
    private route: ActivatedRoute,
    private partsService: PartsService,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.partsService.getPartById(id).subscribe({
      next: (data) => {
        console.log('--- DATOS RECIBIDOS ---', data);
        this.part = data;
        this.movement.partId = data.id;
        this.movement.purchasePrice = data.purchasePrice;
        
        // Forzamos el cambio de estado
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la pieza:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (!this.movement.vehiclePlate.trim()) {
      alert('La matrícula es obligatoria para la trazabilidad.');
      return;
    }

    this.partsService.createMovement(this.movement).subscribe({
      next: () => {
        alert('Movimiento registrado correctamente.');
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert(err.error?.message || 'Error en el servidor');
      }
    });
  }
}