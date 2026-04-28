import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowRequestDataService } from '../../services/data/borrow-request.data.service';
import { BorrowRequestReadDto } from '../../models/dtos/borrow-request.dtos';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {
  private borrowRequestService = inject(BorrowRequestDataService);

  requests: BorrowRequestReadDto[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.borrowRequestService.getPending().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load pending requests.';
        this.loading = false;
      }
    });
  }

  finish(id: number): void {
    this.borrowRequestService.finish(id).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to finish request.')
    });
  }

  reject(id: number): void {
    this.borrowRequestService.reject(id).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to reject request.')
    });
  }
}