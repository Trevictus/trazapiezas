import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface Vehicle {
  plate: string;
  brand: string;
  model: string;
  color?: string; // Opcional para evitar errores de tipado
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private mockedVehicles: Vehicle[] = [
    { plate: '1234ABC', brand: 'AUDI', model: 'A3' }
  ];

  checkVehicleInTallerGP(plate: string): Observable<Vehicle> {
    const vehicle = this.mockedVehicles.find(v => v.plate === plate.toUpperCase());
    return vehicle ? of(vehicle) : throwError(() => new Error('NOT_FOUND'));
  }

  registerQuickVehicle(plate: string): Observable<Vehicle> {
    const newVehicle: Vehicle = { 
      plate: plate.toUpperCase(), 
      brand: 'GENERIC', 
      model: 'NUEVO' 
    };
    this.mockedVehicles.push(newVehicle);
    return of(newVehicle);
  }
}