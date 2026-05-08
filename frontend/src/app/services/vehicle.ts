import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Vehicle {
  plate: string;
  brand: string;
  model: string;
  vin?: string;
  engineCode?: string;
  year?: number;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  checkVehicleInTallerGP(plate: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/external/vehicle/${plate.toUpperCase()}`).pipe(
      catchError(error => {
        console.error('Error checking vehicle in TallerGP:', error);
        return throwError(() => error);
      })
    );
  }

  registerQuickVehicle(plate: string): Observable<Vehicle> {
    const newVehicle: Vehicle = { 
      plate: plate.toUpperCase(), 
      brand: 'GENERIC', 
      model: 'NUEVO',
      year: new Date().getFullYear()
    };
    return new Observable(observer => {
      observer.next(newVehicle);
      observer.complete();
    });
  }
}