import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { HomeComponent } from './core/pages/home/home.component';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { LibrarianLayoutComponent } from './core/pages/librarian-layout/librarian-layout.component';
import { PendingLoansComponent } from './core/pages/loan-returns/pending-loans.component';
import { AddBookComponent } from './core/pages/add-book/add-book.component';
import { InventoryComponent } from './core/pages/inventory/inventory.component';
import { UpdateInventoryComponent } from './core/pages/update-inventory/update-inventory.component';
import { ManageReturnsComponent } from './core/pages/manage-returns/manage-returns.component';
import { OverdueUsersComponent } from './core/pages/overdue-users/overdue-users.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/app.models';

export const routes: Routes = [
    { path: 'login',     component: LoginComponent },
    { path: 'home',      component: HomeComponent,      canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['administrator'] as UserRole[] } },
    {
        path: 'librarian',
        component: LibrarianLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '',                 redirectTo: 'pending-loans', pathMatch: 'full' },
            { path: 'pending-loans',    component: PendingLoansComponent },
            { path: 'add-book',         component: AddBookComponent },
            { path: 'inventory',        component: InventoryComponent },
            { path: 'update-inventory', component: UpdateInventoryComponent },
            { path: 'manage-returns',   component: ManageReturnsComponent },
            { path: 'overdue-users',    component: OverdueUsersComponent },
        ]
    },
    { path: '',  redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
