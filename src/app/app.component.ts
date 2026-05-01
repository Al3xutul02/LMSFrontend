import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./core/pages/shared/nav-bar/nav-bar.component";
import { AuthService } from './core/services/auth.service';
import { BookDetailsComponent } from './core/pages/book-details/book-details.component';
import { BookReadDto } from './core/models/dtos/book.dtos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, ReserveComponent, ReserveComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected readonly authService: AuthService = inject(AuthService);
  public readonly title = 'LMSFrontend';

  async ngOnInit(): Promise<void> {
    await this.authService.isLoggedIn();
  }
}
