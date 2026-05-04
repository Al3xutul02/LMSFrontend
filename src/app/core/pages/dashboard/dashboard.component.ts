import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BranchesPageComponent } from "./branches-page/branches-page.component";
 
type DashboardPage = 'branches' | 'users';
 
@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [CommonModule, BranchesPageComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  activePage: DashboardPage = 'branches';
 
  setPage(page: DashboardPage): void {
    this.activePage = page;
  }
}