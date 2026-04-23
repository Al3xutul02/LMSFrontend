import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./core/pages/shared/nav-bar/nav-bar.component";
import { ReserveComponent } from "./core/pages/Reserve/reserve.component";
import { BookReadDto } from './core/models/dtos/book.dtos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, ReserveComponent, ReserveComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  public readonly title = 'LMSFrontend';
  testBook: BookReadDto = {
    isbn: 1024,
    title: 'Test Book',
    author: 'Test Author',
    description: 'This is a test book for demonstration purposes.',
    genres: ['fantasy', 'action'],
    count: 5,
    status: 'in-stock'

  };

  ngOnInit() {
    localStorage.setItem("reservationList", JSON.stringify([]));
  }
}
