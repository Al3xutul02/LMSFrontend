import { Component, inject, Input } from "@angular/core";
import { BookDataService } from "../../services/data/book.data.service";
import { BookReadDto } from "../../models/dtos/book.dtos" ;


@Component({
  selector: 'book-details',
  imports: [],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent {
  bookDataService: BookDataService = inject(BookDataService);

  @Input() bookDto: BookReadDto | null = null;
}
