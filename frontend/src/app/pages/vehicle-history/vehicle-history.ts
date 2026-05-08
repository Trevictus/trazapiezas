import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation';
import { PartsService } from '../../services/parts';
import { AuthService } from '../../services/auth';
import { debounceTime, Subject } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  vehicleData: any = null;
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
        this.extractVehicleData(data);
      },
      error: (err: any) => {
        console.error('Error al buscar matrícula:', err);
        this.movements = [];
        this.searched = true;
        this.vehicleData = null;
      }
    });
  }

  extractVehicleData(movements: any[]): void {
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

    doc.setFillColor(9, 9, 11);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TRAZAPIEZAS', 20, yPosition);

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.text(`Informe de Trazabilidad - ${new Date().toLocaleDateString('es-ES')}`, 20, yPosition + 8);
    doc.text('CAZAPIEZAS S.L.', 20, yPosition + 13);

    doc.setDrawColor(4, 93, 209);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition + 17, pageWidth - 20, yPosition + 17);

    yPosition += 25;

    doc.setFillColor(20, 20, 20);
    doc.rect(20, yPosition, pageWidth - 40, 35, 'F');
    doc.setDrawColor(4, 93, 209);
    doc.rect(20, yPosition, pageWidth - 40, 35);

    doc.setFontSize(10);
    doc.setTextColor(4, 93, 209);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA TÉCNICA', 25, yPosition + 6);

    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');

    const vehicleDataText = [
      [`MATRÍCULA: ${this.vehicleData?.plate || this.plate}`, `VIN: ${this.vehicleData?.vin || 'N/A'}`],
      [`CÓDIGO MOTOR: ${this.vehicleData?.engineCode || 'N/A'}`]
    ];

    let dataY = yPosition + 12;
    vehicleDataText.forEach(row => {
      row.forEach((text, index) => {
        doc.text(text, 25 + (index * 60), dataY);
      });
      dataY += 6;
    });

    yPosition += 42;

    doc.setFontSize(11);
    doc.setTextColor(4, 93, 209);
    doc.setFont('helvetica', 'bold');
    doc.text('MOVIMIENTOS DEL VEHÍCULO', 20, yPosition);

    yPosition += 8;

    const tableData = this.movements.map(mov => [
      new Date(mov.createdAt).toLocaleDateString('es-ES'),
      mov.user?.username || 'Sistema',
      `${mov.part.brand} - ${mov.part.reference}`,
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
        fillColor: [25, 25, 25],
        textColor: [200, 200, 200],
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [35, 35, 35]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 70 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' }
      },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        const pageWidth = pageSize.getWidth();
        
        doc.setDrawColor(4, 93, 209);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `TRAZAPIEZAS © 2026 | Página ${data.pageNumber}`,
          pageWidth / 2,
          pageHeight - 8,
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