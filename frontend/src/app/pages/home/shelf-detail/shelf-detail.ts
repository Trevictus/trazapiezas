import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../../services/warehouse';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';

interface Shelf {
  id: string;
  name: string;
  description: string;
  parts: Part[];
}

interface Part {
  id: number;
  reference: string;
  brand: string;
  category: string;
  stock: number;
}

@Component({
  selector: 'app-shelf-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shelf-detail.html',
})
export class ShelfDetailComponent implements OnInit {
  shelf: Shelf | null = null;
  filteredParts: Part[] = [];
  searchQuery = '';
  loading = false;
  shelfId: string = '';
  currentUserRole: 'ADMIN' | 'MECHANIC' = 'MECHANIC';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.currentUserRole = this.authService.getUserRole() as 'ADMIN' | 'MECHANIC';
    this.route.params.subscribe((params) => {
      this.shelfId = params['id'];
      this.loadShelf();
    });
  }

  loadShelf() {
    this.loading = true;
    this.warehouseService.getShelfById(this.shelfId).subscribe({
      next: (data) => {
        this.shelf = data;
        this.filteredParts = data.parts || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Error al cargar la estantería', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearchChange() {
    if (!this.shelf) return;

    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredParts = this.shelf.parts || [];
    } else {
      this.filteredParts = (this.shelf.parts || []).filter(
        (part) =>
          part.reference.toLowerCase().includes(query) ||
          part.brand.toLowerCase().includes(query) ||
          part.category.toLowerCase().includes(query),
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    return this.currentUserRole === 'ADMIN';
  }

  goRegisterMovement(partId: number, mode: 'USED' | 'STOCK') {
    if (mode === 'STOCK' && !this.isAdmin) {
      this.toastService.error('Solo administradores pueden registrar entradas');
      return;
    }

    this.router.navigate(['/register-movement', partId], {
      queryParams: { mode },
    });
  }

  goBack() {
    this.router.navigate(['/inventory']);
  }
}
