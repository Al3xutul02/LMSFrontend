import { Component, inject, Input } from "@angular/core";
import { BookDataService } from "../../services/data/book.data.service";
import { BookReadDto } from "../../models/dtos/book.dtos" ;
import { CommonModule } from "@angular/common";


@Component({
  selector: 'book-details',
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent {
  bookDataService: BookDataService = inject(BookDataService);

  @Input() bookDto: BookReadDto | null = null;
}
