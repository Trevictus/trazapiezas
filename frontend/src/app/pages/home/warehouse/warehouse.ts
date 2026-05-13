import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WarehouseService } from '../../../services/warehouse';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

interface Shelf {
  id: string;
  name: string;
  description: string;
  parts: any[];
}

interface GeneratingQR {
  shelfId: string | null;
  dataUrl: string | null;
}

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './warehouse.html',
})
export class WarehouseComponent implements OnInit {
  shelves: Shelf[] = [];
  loading = false;
  generatingQR: GeneratingQR = { shelfId: null, dataUrl: null };
  userRole: string = '';

  newShelf = {
    name: '',
    description: '',
  };

  constructor(
    public router: Router,
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadShelves();
    this.userRole = this.authService.getUserRole();
  }

  loadShelves() {
    this.loading = true;
    this.warehouseService.getShelves().subscribe({
      next: (data) => {
        this.shelves = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.show('Error al cargar estanterías', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  createShelf() {
    if (!this.newShelf.name.trim()) {
      this.toastService.show('Ingresa un nombre para la estantería', 'error');
      return;
    }

    this.warehouseService.createShelf(this.newShelf).subscribe({
      next: (newShelf) => {
        this.toastService.show('Estantería creada correctamente', 'success');
        this.shelves = [...this.shelves, newShelf];
        this.newShelf = { name: '', description: '' };
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Error al crear estantería', 'error');
      },
    });
  }

  async generateQR(shelf: Shelf) {
    try {
      const qrUrl = `${window.location.origin}/inventory/shelf/${shelf.id}`;
      const dataUrl = await QRCode.toDataURL(qrUrl);
      this.generatingQR = { shelfId: shelf.id, dataUrl };
    } catch (error) {
      this.toastService.show('Error al generar código QR', 'error');
    }
  }

  printQR() {
    if (this.generatingQR.dataUrl && this.generatingQR.shelfId) {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [62, 62],
        putOnlyUsedFonts: true,
      });

      const shelfName =
        this.shelves.find((s) => s.id === this.generatingQR.shelfId)?.name || 'BALDA';
      const pageWidth = 62;
      const pageHeight = 62;

      doc.setFontSize(12);
      doc.setFont('courier', 'bold');
      doc.text(shelfName, 31, 3, { align: 'center' });

      const qrSize = 58;
      const qrX = 2;
      const qrY = 4;
      doc.addImage(this.generatingQR.dataUrl, 'PNG', qrX, qrY, qrSize, qrSize, 'FAST');

      doc.setFontSize(6);
      doc.setFont('courier', 'normal');
      doc.text('TRAZAPIEZAS', 31, 60, { align: 'center' });

      window.open(doc.output('bloburl'), '_blank');
    }
  }

  closeQRModal() {
    this.generatingQR = { shelfId: null, dataUrl: null };
  }

  deleteShelf(id: string) {
    if (confirm('¿Eliminar esta estantería?')) {
      this.warehouseService.deleteShelf(id).subscribe({
        next: () => {
          this.shelves = this.shelves.filter((s) => s.id !== id);
          this.toastService.show('Estantería eliminada', 'success');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastService.show('Error al eliminar estantería', 'error');
        },
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
