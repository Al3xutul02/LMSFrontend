import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// Importăm LoanDataService din calea corectă din proiectul tău
import { LoanDataService } from './../../../services/data/loan.data.service';

@Component({
  selector: 'app-librarian-see-user-details',
  standalone: true,
  imports: [CommonModule],
  // Am adăugat '.component' în nume pentru a se potrivi exact cu fișierele tale de pe disc
  templateUrl: './librarian-see-user-details.component.html',
  styleUrl: './librarian-see-user-details.component.scss'
})
export class LibrarianSeeUserDetailsComponent implements OnInit {
  public loanDetails: any;
  public loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly loanService: LoanDataService 
  ) {}

  ngOnInit(): void {
    const id = 2;
    if (id) {
      this.fetchDetails(id);
    }
  }

 fetchDetails(id: number): void {
    // Folosește noua metodă, nu getItemById
    this.loanService.getLoanDetails(id).subscribe({
      next: (data) => {
        console.log("Date primite:", data); // Verifică în consola browserului
        this.loanDetails = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Eroare la încărcare:', err);
        this.loading = false;
      }
    });
}

  approveRequest(): void {
  if (this.loanDetails) {
    this.loanService.approveRequest(this.loanDetails.requestId).subscribe({
      next: (isSuccess: boolean) => {
        if (isSuccess) {
          alert('Cerere aprobată cu succes!');
          this.fetchDetails(this.loanDetails.requestId);
        }
      },
      error: (err) => alert('Eroare la aprobare: ' + err.message)
    });
  }
}

rejectRequest(): void {
  if (this.loanDetails && confirm('Sigur dorești să respingi această cerere?')) {
    this.loanService.rejectRequest(this.loanDetails.requestId).subscribe({
      next: (isSuccess: boolean) => {
        if (isSuccess) {
          alert('Cerere respinsă.');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => alert('Eroare la respingere: ' + err.message)
    });
  }
}

  /**
   * Deschide fereastra de imprimare a browserului
   * Corespunde cu (click)="print()" din HTML
   */
  print(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}