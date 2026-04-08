import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./core/pages/shared/nav-bar/nav-bar.component";
import { BookDetailsComponent } from './core/pages/book-details/book-details.component';
import { BookReadDto } from './core/models/dtos/book.dtos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, BookDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly title = 'LMSFrontend';
  public readonly bookDto: BookReadDto = {
    ISBN: 0,
    Title: "Test Title",
    Author: "Test Author",
    Description: "Lorem Ipsum Est",
    Genres: ['action', 'adventure'],
    Count: 3,
    Status: 'in-stock',
    LoanDurationDays: 14,
    CanBeReserved: true
  };
}
