import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/app.models';
import { HomeComponent } from './core/pages/home/home.component';
import { ReserveComponent } from './core/pages/reserve/reserve.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent,
        canActivate: [AuthGuard] },
    { path: 'reserve/:isbn', component: ReserveComponent,
        canActivate: [AuthGuard]},
    { path: 'dashboard', component: DashboardComponent,
        canActivate: [AuthGuard], data: { roles: ['administrator'] as UserRole[] } },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
