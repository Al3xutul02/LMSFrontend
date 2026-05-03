import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BranchDataService } from "../../../services/data/branch.data.service";
import { UserDataService } from "../../../services/data/user.data.service";
import { BranchReadDto, BranchCreateDto, BranchUpdateDto } from "../../../models/dtos/branch.dtos";
import { UserReadDto } from "../../../models/dtos/user.dtos";
 
@Component({
  selector: 'branches-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branches-page.component.html',
  styleUrls: ['./branches-page.component.scss']
})
export class BranchesPageComponent implements OnInit {
  branches: BranchReadDto[] = [];
  allUsers: UserReadDto[] = [];
  expandedId: number | null = null;
  loading = true;
  error: string | null = null;
 
  // Modal state
  showModal = false;
  isEditMode = false;
  modalError: string | null = null;
  saving = false;
 
  // Form model
  form: { id?: number; name: string; address: string; isOpen: boolean } = {
    name: '', address: '', isOpen: true
  };
 
  // Delete confirm
  deleteConfirmId: number | null = null;
 
  constructor(
    private branchService: BranchDataService,
    private userService: UserDataService
  ) {}
 
  ngOnInit(): void {
    this.loadAll();
  }
 
  loadAll(): void {
    this.loading = true;
    this.error = null;
    this.branchService.getItems().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.userService.getItems().subscribe({
          next: (users) => { this.allUsers = users; this.loading = false; },
          error: () => { this.allUsers = []; this.loading = false; }
        });
      },
      error: (err) => {
        this.error = 'Failed to load branches.';
        this.loading = false;
      }
    });
  }
 
  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
    // Clear any pending delete confirm when switching rows
    this.deleteConfirmId = null;
  }
 
  getLibrarians(branch: BranchReadDto): UserReadDto[] {
    if (!branch.employeeIds || branch.employeeIds.length === 0) return [];
    return this.allUsers.filter(u => branch.employeeIds!.includes(u.id));
  }
 
  // ── Add / Edit modal ──
  openAdd(): void {
    this.isEditMode = false;
    this.form = { name: '', address: '', isOpen: true };
    this.modalError = null;
    this.showModal = true;
  }
 
  openEdit(branch: BranchReadDto, event: Event): void {
    event.stopPropagation();
    this.isEditMode = true;
    this.form = { id: branch.id, name: branch.name, address: branch.address, isOpen: branch.isOpen };
    this.modalError = null;
    this.showModal = true;
  }
 
  closeModal(): void {
    this.showModal = false;
    this.modalError = null;
  }
 
  saveModal(): void {
    if (!this.form.name.trim() || !this.form.address.trim()) {
      this.modalError = 'Name and address are required.';
      return;
    }
    this.saving = true;
    this.modalError = null;
 
    if (this.isEditMode) {
      const dto: BranchUpdateDto = {
        id: this.form.id!,
        name: this.form.name,
        address: this.form.address,
        isOpen: this.form.isOpen
      };
      this.branchService.updateItem(dto).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadAll(); },
        error: () => { this.saving = false; this.modalError = 'Failed to update branch.'; }
      });
    } else {
      const dto: BranchCreateDto = {
        name: this.form.name,
        address: this.form.address,
        isOpen: this.form.isOpen
      };
      this.branchService.addItem(dto).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadAll(); },
        error: () => { this.saving = false; this.modalError = 'Failed to create branch.'; }
      });
    }
  }
 
  // ── Delete ──
  requestDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.deleteConfirmId = id;
  }
 
  cancelDelete(): void {
    this.deleteConfirmId = null;
  }
 
  confirmDelete(id: number): void {
    this.branchService.deleteItem(id).subscribe({
      next: () => {
        this.deleteConfirmId = null;
        if (this.expandedId === id) this.expandedId = null;
        this.loadAll();
      },
      error: () => { this.deleteConfirmId = null; }
    });
  }
}