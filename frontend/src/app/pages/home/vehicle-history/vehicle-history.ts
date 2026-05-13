import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartsService } from '../../../services/parts';
import { AuthService } from '../../../services/auth';
import { debounceTime, Subject } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Movement } from '../../../models/movement';
import { Vehicle } from '../../../models/vehicle';

@Component({
  selector: 'app-vehicle-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './vehicle-history.html'
})
export class VehicleHistoryComponent implements OnInit {
  plate: string = '';
  movements: Movement[] = [];
  searched: boolean = false;
  allMovements: Movement[] = [];
  vehicleData: Vehicle | null = null;
  private searchSubject = new Subject<string>();

  constructor(
    private partsService: PartsService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAllMovements();

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchPlate => {
      if (searchPlate.trim()) {
        this.performSearch(searchPlate);
      } else {
        this.movements = this.allMovements;
        this.searched = false;
        this.vehicleData = null;
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar movimientos:', err);
        this.movements = [];
        this.cdr.detectChanges();
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
        this.extractVehicleData(data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al buscar matrícula:', err);
        this.movements = [];
        this.searched = true;
        this.vehicleData = null;
        this.cdr.detectChanges();
      }
    });
  }

  extractVehicleData(movements: Movement[]): void {
    if (movements.length > 0) {
      const firstMovement = movements.find(m => m.vin || m.engineCode);
      this.vehicleData = firstMovement ? {
        plate: this.plate,
        vin: firstMovement.vin || 'No registrado',
        engineCode: firstMovement.engineCode || 'No registrado'
      } : {
        plate: this.plate,
        vin: 'No registrado',
        engineCode: 'No registrado'
      };
      this.cdr.detectChanges();
    }
  }

  search(): void {
    this.searchSubject.next(this.plate);
  }

  exportToPDF(): void {
    if (!this.movements || this.movements.length === 0) {
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.addImage('/assets/logo.png', 'PNG', 10, 8, 45, 15);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`Informe de Trazabilidad - ${new Date().toLocaleDateString('es-ES')}`, 60, yPosition);
    doc.text('CAZAPIEZAS S.L.', 60, yPosition + 5);

    doc.setDrawColor(4, 93, 209);
    doc.setLineWidth(0.5);

    if (this.vehicleData) {
      yPosition += 25;

      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition, pageWidth - 20, 28, 'F');
      doc.setDrawColor(4, 93, 209);
      doc.rect(10, yPosition, pageWidth - 20, 28);

      doc.setFontSize(10);
      doc.setTextColor(4, 93, 209);
      doc.setFont('helvetica', 'bold');
      doc.text('FICHA TÉCNICA', 15, yPosition + 6);

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      const vehicleDataText = [
        [`MATRÍCULA: ${this.vehicleData?.plate || this.plate || 'N/A'}`],
        [`VIN: ${this.vehicleData?.vin || 'N/A'}`],
        [`CÓDIGO MOTOR: ${this.vehicleData?.engineCode || 'N/A'}`]
      ];

      let dataY = yPosition + 12;
      vehicleDataText.forEach((row, rowIndex) => {
        row.forEach((text, index) => {
          doc.text(text, 15 + (index * 80), dataY);
        });
        if (rowIndex !== vehicleDataText.length - 1)
          dataY += 6;
      });

      yPosition += 38;

    } else {
      yPosition += 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(4, 93, 209);
    doc.setFont('helvetica', 'bold');
    doc.text(this.vehicleData ? 'MOVIMIENTOS DEL VEHÍCULO' : 'TODOS LOS MOVIMIENTOS', 10, yPosition);

    yPosition += 3;

    const tableData = this.movements.map(mov => [
      new Date(mov.createdAt).toLocaleDateString('es-ES'),
      mov.user?.username || 'Sistema',
      `${mov.part.brand} - ${mov.part.reference} (${mov.part.description || 'S/D'})`,
      mov.quantity.toString(),
      mov.status === 'STOCK' ? 'ENTRADA' : 'SALIDA'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['FECHA', 'OPERARIO', 'PIEZA / REFERENCIA', 'CANTIDAD', 'TIPO']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [4, 93, 209],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 3
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 85 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' }
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        const pageWidth = pageSize.getWidth();

        doc.setDrawColor(4, 93, 209);
        doc.setLineWidth(0.5);

        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text(
          `TRAZAPIEZAS © 2026 | Página ${data.pageNumber}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }
    });

    doc.save(`trazabilidad_${this.plate.replace(/\s/g, '')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}