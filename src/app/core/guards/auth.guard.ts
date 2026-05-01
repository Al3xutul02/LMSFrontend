import { inject, Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const isLoggedIn = await this.authService.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as UserRole[] | undefined;

    if (requiredRoles?.length) {
      try {
        const userRole = this.authService.getUserRole();
        if (!requiredRoles.some(r => r === userRole)) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      } catch (error) {
        console.error('Error retrieving user role:', error);
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }
}