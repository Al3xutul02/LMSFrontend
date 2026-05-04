import { Routes } from '@angular/router';
import { PendingLoansComponent } from './core/pages/loan-returns/pending-loans.component';
import { AddBookComponent } from './core/pages/add-book/add-book.component';
import { InventoryComponent } from './core/pages/inventory/inventory.component';
import { OverdueUsersComponent } from './core/pages/overdue-users/overdue-users.component';
import { UpdateInventoryComponent } from './core/pages/update-inventory/update-inventory.component';
import { ManageReturnsComponent } from './core/pages/manage-returns/manage-returns.component';

export const routes: Routes = [
  { path: '',                 redirectTo: 'pending-loans', pathMatch: 'full' },
  { path: 'pending-loans',    component: PendingLoansComponent },
  { path: 'add-book',         component: AddBookComponent },
  { path: 'inventory',        component: InventoryComponent },
  { path: 'update-inventory', component: UpdateInventoryComponent },
  { path: 'manage-returns',   component: ManageReturnsComponent },
  { path: 'overdue-users',    component: OverdueUsersComponent }
import { LoginComponent } from './core/pages/login/login.component';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/app.models';
import { HomeComponent } from './core/pages/home/home.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent,
        canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent,
        canActivate: [AuthGuard], data: { roles: ['administrator'] as UserRole[] } },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
