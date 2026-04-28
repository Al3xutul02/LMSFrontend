import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./core/pages/shared/nav-bar/nav-bar.component";
import { ReaderSeeProfileComponent } from './core/pages/reader-see-profile/reader-see-profile.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent,ReaderSeeProfileComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly title = 'LMSFrontend';
}

