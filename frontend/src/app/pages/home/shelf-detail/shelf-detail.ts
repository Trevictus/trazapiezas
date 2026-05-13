import { Component, OnInit } from '@angular/core';

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

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
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
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Error al cargar la estantería', 'error');
        this.loading = false;
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

  goBack() {
    this.router.navigate(['/inventory']);
  }
}
