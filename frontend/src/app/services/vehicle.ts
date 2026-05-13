import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/external`;

  constructor(private http: HttpClient) { }

  checkVehicleInTallerGP(plate: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/vehicle/${plate.toUpperCase()}`).pipe(
      catchError(error => {
        console.error('Error checking vehicle in TallerGP:', error);
        return throwError(() => error);
      })
    );
  }

  registerQuickVehicle(plate: string): Observable<Vehicle> {
    const newVehicle: Vehicle = {
      plate: plate.toUpperCase(),
      brand: 'S/D',
      model: 'IDENTIFICACIÓN MANUAL',
      year: undefined
    };
    return new Observable(observer => {
      observer.next(newVehicle);
      observer.complete();
    });
  }
}