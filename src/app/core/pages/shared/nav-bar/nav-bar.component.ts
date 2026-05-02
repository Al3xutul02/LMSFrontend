import { Component, inject } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { RouterLink } from "@angular/router";
 
@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  protected readonly authService: AuthService = inject(AuthService);

  get isAdmin(): boolean {
    try {
      var result = this.authService.getUserRole() === 'administrator';
      return result;
    } catch {
      return false;
    }
  }

  get isLibrarian(): boolean {
    try {
      var result = this.authService.getUserRole() === 'librarian';
      return result;
    } catch {
      return false;
    }
  }
}