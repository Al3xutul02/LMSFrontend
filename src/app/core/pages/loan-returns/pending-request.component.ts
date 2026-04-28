import { Component, OnInit } from '@angular/core';
import { LoanReadDto, LoanUpdateDto } from 'src/app/models/dtos/loan.dtos';
import { LoanStatus } from 'src/app/models/app.models';
import { LoanDataService } from 'src/app/services/data/loan-data.service';

@Component({
  selector: 'app-finish-request',
  templateUrl: './finish-request.component.html',
  styleUrls: ['./finish-request.component.scss']
})
export class FinishRequestComponent implements OnInit {
  pendingLoans: LoanReadDto[] = [];

  constructor(private loanDataService: LoanDataService) {}

  ngOnInit(): void {
    this.loadPendingLoans();
  }

  loadPendingLoans(): void {
    // Luăm toate împrumuturile și le filtrăm pe cele care nu sunt returnate
    this.loanDataService.getAll().subscribe({
      next: (data) => {
        this.pendingLoans = data.filter(loan => loan.status !== LoanStatus.Returned);
      },
      error: (err) => console.error('Eroare la încărcarea împrumuturilor', err)
    });
  }

  onFinishLoan(loan: LoanReadDto): void {
    // Creăm obiectul de update bazat pe datele existente, dar schimbăm statusul
    const updateDto: LoanUpdateDto = {
      id: loan.id,
      issueDate: loan.issueDate,
      dueDate: loan.dueDate,
      status: LoanStatus.Returned, // Aceasta este valoarea 2 care declanșează logica de stoc în backend
      bookRelations: loan.bookRelations
    };

    // Apelăm metoda update din serviciul tău generic
    this.loanDataService.update(updateDto).subscribe({
      next: (success) => {
        if (success) {
          alert('Împrumut finalizat cu succes! Cărțile au revenit în stoc.');
          this.loadPendingLoans(); // Reîmprospătăm lista
        }
      },
      error: (err) => alert('Eroare la finalizarea cererii: ' + err.message)
    });
  }
}