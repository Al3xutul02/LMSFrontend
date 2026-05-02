import { Routes } from '@angular/router';
import { PendingLoansComponent } from './core/pages/loan-returns/pending-loans.component';
import { AddBookComponent } from './core/pages/add-book/add-book.component';
import { InventoryComponent } from './core/pages/inventory/inventory.component';

export const routes: Routes = [
  { path: '',               redirectTo: 'pending-loans', pathMatch: 'full' },
  { path: 'pending-loans',  component: PendingLoansComponent },
  { path: 'add-book',       component: AddBookComponent },
  { path: 'inventory',      component: InventoryComponent }
];
