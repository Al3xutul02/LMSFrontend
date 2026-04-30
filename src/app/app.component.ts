import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./core/pages/shared/nav-bar/nav-bar.component";
import { LibrarianSeeUserDetailsComponent } from './core/pages/shared/librarian-see-user-details/librarian-see-user-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, LibrarianSeeUserDetailsComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly title = 'LMSFrontend';
}