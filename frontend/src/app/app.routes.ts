import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/home/dashboard/dashboard';
import { PartsListComponent } from './pages/home/parts-list/parts-list';
import { AddPartComponent } from './pages/home/add-part/add-part';
import { VehicleHistoryComponent } from './pages/home/vehicle-history/vehicle-history';
import { RegisterMovementComponent } from './pages/home/register-movement/register-movement';
import { ProfileComponent } from './pages/home/profile/profile';
import { StaffManagementComponent } from './pages/home/staff-management/staff-management';
import { WarehouseComponent } from './pages/home/warehouse/warehouse';
import { ShelfDetailComponent } from './pages/home/shelf-detail/shelf-detail';
import { authGuard } from './guards/auth.guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: Home,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'add-part', component: AddPartComponent, canActivate: [authGuard] },
      { path: 'inventory', component: PartsListComponent, canActivate: [authGuard] },
      { path: 'inventory/shelf/:id', component: ShelfDetailComponent, canActivate: [authGuard] },
      { path: 'warehouse', component: WarehouseComponent, canActivate: [authGuard] },
      { path: 'history', component: VehicleHistoryComponent, canActivate: [authGuard] },
      { path: 'register-movement/:id', component: RegisterMovementComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'staff', component: StaffManagementComponent, canActivate: [authGuard] }
    ]
  }
];