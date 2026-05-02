import { Routes } from '@angular/router';
import { PendingLoansComponent } from './core/pages/loan-returns/pending-loans.component';

export const routes: Routes = [
  { path: '', component: PendingLoansComponent },
  { path: 'pending-loans', component: PendingLoansComponent }
];
