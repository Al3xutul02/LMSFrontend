import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/data/user.data.service';
import { UserReadDto } from '../../../core/models/dtos/user.dtos';
import { CommonModule} from "@angular/common";


@Component({
  selector: 'app-reader-see-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reader-see-profile.component.html',
  styleUrls: ['./reader-see-profile.component.scss']
})
export class ReaderSeeProfileComponent implements OnInit {
  userProfile?: UserReadDto;
  borrowedCount: number = 0;
  returnList: any[] = [];
  recommendations: any[] = [];
  isFavorite: boolean = false;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    
    this.userDataService.getUserProfile(2).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loadBorrowingData();
      }
    });
  }

  loadBorrowingData() {
   
    this.borrowedCount = 6; 
    this.returnList = [
      { title: 'The Hidden Cipher', dueDate: new Date('2026-05-15') },
      { title: 'Echo of Shadows', dueDate: new Date('2026-04-20') }
    ];
    
    this.recommendations = [
      { title: 'Mysterious Island', author: 'Stefan Balaceanu', coverUrl: 'assets/book1.jpg' },
      { title: 'The Three Cipher', author: 'Alex Popescu', coverUrl: 'assets/book2.jpg' }
    ];
  }

  isOverdue(date: Date): boolean {
    return new Date() > date;
  }

  toggleFavoriteGenre() {
    this.isFavorite = !this.isFavorite;
  }

  navigateToCatalog() {
  }
}