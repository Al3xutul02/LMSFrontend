import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./core/pages/shared/nav-bar/nav-bar.component";
import { PendingRequestsComponent } from './core/pages/loan-returns/pending-request.component';
import { AddBookComponent } from './core/pages/add-book/add-book.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, PendingRequestsComponent, AddBookComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly title = 'LMSFrontend';
}
