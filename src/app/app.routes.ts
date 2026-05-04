import { Routes } from '@angular/router';
import { PendingLoansComponent } from './core/pages/loan-returns/pending-loans.component';
import { AddBookComponent } from './core/pages/add-book/add-book.component';
import { InventoryComponent } from './core/pages/inventory/inventory.component';
import { OverdueUsersComponent } from './core/pages/overdue-users/overdue-users.component';
import { UpdateInventoryComponent } from './core/pages/update-inventory/update-inventory.component';
import { ManageReturnsComponent } from './core/pages/manage-returns/manage-returns.component';

export const routes: Routes = [
  { path: '',                 redirectTo: 'pending-loans', pathMatch: 'full' },
  { path: 'pending-loans',    component: PendingLoansComponent },
  { path: 'add-book',         component: AddBookComponent },
  { path: 'inventory',        component: InventoryComponent },
  { path: 'update-inventory', component: UpdateInventoryComponent },
  { path: 'manage-returns',   component: ManageReturnsComponent },
  { path: 'overdue-users',    component: OverdueUsersComponent }
];
