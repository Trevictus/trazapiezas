import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { PartsListComponent } from './pages/parts-list/parts-list';
import { AddPartComponent } from './pages/add-part/add-part';
import { VehicleHistoryComponent } from './pages/vehicle-history/vehicle-history';
import { RegisterMovementComponent } from './pages/register-movement/register-movement';
import { ProfileComponent } from './pages/profile/profile';
import { StaffManagementComponent } from './pages/staff-management/staff-management';
import { WarehouseComponent } from './pages/warehouse/warehouse';
import { ShelfDetailComponent } from './pages/shelf-detail/shelf-detail';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'add-part', component: AddPartComponent, canActivate: [authGuard] },
  { path: 'inventory', component: PartsListComponent, canActivate: [authGuard] },
  { path: 'inventory/shelf/:id', component: ShelfDetailComponent, canActivate: [authGuard] },
  { path: 'warehouse', component: WarehouseComponent, canActivate: [authGuard] },
  { path: 'history', component: VehicleHistoryComponent, canActivate: [authGuard] },
  { path: 'register-movement/:id', component: RegisterMovementComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'staff', component: StaffManagementComponent, canActivate: [authGuard] }
];