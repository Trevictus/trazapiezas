import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { PartsListComponent } from './pages/parts-list/parts-list';
import { AddPartComponent } from './pages/add-part/add-part';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-part', component: AddPartComponent },
  { path: 'inventory', component: PartsListComponent }
];