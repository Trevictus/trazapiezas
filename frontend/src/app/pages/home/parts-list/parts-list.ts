import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PartsService } from '../../../services/parts';
import { AuthService } from '../../../services/auth';
import { ConfirmationService } from '../../../services/confirmation';
import { Part } from '../../../models/part';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parts-list.html'
})
export class PartsListComponent implements OnInit {
  parts: Part[] = [];
  searchTerm: string = '';
  filterLowStock: boolean = false;
  movementMode: 'USED' | 'STOCK' = 'USED';

  constructor(
    private partsService: PartsService,
    public router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterLowStock = params['filter'] === 'lowstock';
      this.movementMode = params['mode'] === 'STOCK' ? 'STOCK' : 'USED';
      this.loadParts();
    });
  }

  loadParts(): void {
    this.partsService.getParts().subscribe({
      next: (data) => {
        this.parts = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.parts = [];
        this.toastService.show(err.error?.message || 'Error al cargar piezas', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  get filteredParts() {
    let filtered = this.parts.filter(part =>
      part.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      part.reference.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.filterLowStock) {
      filtered = filtered.filter(part => part.stock < 5);
    }

    return filtered;
  }

  adjustStock(part: Part, amount: number): void {
    const newStock = part.stock + amount;
    if (newStock < 0) return;

    const updatedPart = { ...part, stock: newStock, userId: this.authService.getCurrentUser()?.id || null };

    this.partsService.updatePart(part.id, updatedPart).subscribe({
      next: () => {
        this.toastService.show('Stock actualizado', 'success');
        part.stock = newStock;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Error al actualizar stock', 'error')
    });
  }

  deletePart(part: Part): void {
    this.confirmationService.confirm(
      `¿Estás seguro de eliminar ${part.brand}?`,
      {
        title: 'Eliminar pieza',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        severity: 'error'
      }
    ).then(confirmed => {
      if (confirmed) {
        this.partsService.deletePart(part.id).subscribe({
          next: () => {
            this.toastService.show('Pieza eliminada', 'success');
            this.parts = this.parts.filter(p => p.id !== part.id);
            this.cdr.detectChanges();
          },
          error: (err) => this.toastService.show(err.error?.message || 'Error al eliminar pieza', 'error')
        });
      }
    });
  }

  clearFilter(): void {
    this.router.navigate(['/inventory']);
  }

  goToUsedMode(): void {
    this.router.navigate(['/inventory'], {
      queryParams: {
        ...(this.filterLowStock ? { filter: 'lowstock' } : {})
      }
    });
  }

  goToMovement(part: Part): void {
    this.router.navigate(['/register-movement', part.id], {
      queryParams: { mode: this.movementMode }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}