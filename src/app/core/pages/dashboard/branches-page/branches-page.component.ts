import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BranchDataService } from "../../../services/data/branch.data.service";
import { UserDataService } from "../../../services/data/user.data.service";
import { BranchReadDto, BranchCreateDto, BranchUpdateDto } from "../../../models/dtos/branch.dtos";
import { UserReadDto, UserUpdateDto } from "../../../models/dtos/user.dtos";
import { BodyPortalDirective } from "../../../directives/body-portal.directive";

@Component({
  selector: 'branches-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BodyPortalDirective],
  templateUrl: './branches-page.component.html',
  styleUrls: ['./branches-page.component.scss']
})
export class BranchesPageComponent implements OnInit {
  branches: BranchReadDto[] = [];
  allUsers: UserReadDto[] = [];
  expandedId: number | null = null;
  loading = true;
  error: string | null = null;

  // Branch modal
  showModal = false;
  isEditMode = false;
  modalError: string | null = null;
  saving = false;
  form: { id?: number; name: string; address: string; isOpen: boolean } = {
    name: '', address: '', isOpen: true
  };

  // Delete branch confirm
  deleteConfirmId: number | null = null;

  // Librarian management
  showLibrarianModal = false;
  librarianModalBranch: BranchReadDto | null = null;
  librarianSearch = '';
  librarianSaving = false;
  removeConfirmId: number | null = null;

  constructor(
    private branchService: BranchDataService,
    private userService: UserDataService
  ) {}

  ngOnInit(): void { this.loadAll(); }

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
      error: () => { this.error = 'Failed to load branches.'; this.loading = false; }
    });
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
    this.deleteConfirmId = null;
    this.removeConfirmId = null;
  }

  getLibrarians(branch: BranchReadDto): UserReadDto[] {
    return this.allUsers.filter(u => u.branchId === branch.id && u.role === 'librarian');
  }

  // ── Branch add/edit ──
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

  closeModal(): void { this.showModal = false; this.modalError = null; }

  saveModal(): void {
    if (!this.form.name.trim() || !this.form.address.trim()) {
      this.modalError = 'Name and address are required.';
      return;
    }
    this.saving = true;
    this.modalError = null;

    if (this.isEditMode) {
      const dto: BranchUpdateDto = { id: this.form.id!, name: this.form.name, address: this.form.address, isOpen: this.form.isOpen };
      this.branchService.updateItem(dto).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadAll(); },
        error: () => { this.saving = false; this.modalError = 'Failed to update branch.'; }
      });
    } else {
      const dto: BranchCreateDto = { name: this.form.name, address: this.form.address, isOpen: this.form.isOpen };
      this.branchService.addItem(dto).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadAll(); },
        error: () => { this.saving = false; this.modalError = 'Failed to create branch.'; }
      });
    }
  }

  // ── Delete branch ──
  requestDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.deleteConfirmId = id;
  }

  cancelDelete(): void { this.deleteConfirmId = null; }

  confirmDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.branchService.deleteItem(id).subscribe({
      next: () => {
        this.deleteConfirmId = null;
        if (this.expandedId === id) this.expandedId = null;
        this.loadAll();
      },
      error: () => { this.deleteConfirmId = null; }
    });
  }

  // ── Librarian modal ──
  openLibrarianModal(branch: BranchReadDto, event: Event): void {
    event.stopPropagation();
    this.librarianModalBranch = branch;
    this.librarianSearch = '';
    this.removeConfirmId = null;
    this.showLibrarianModal = true;
  }

  closeLibrarianModal(): void {
    this.showLibrarianModal = false;
    this.librarianModalBranch = null;
    this.librarianSearch = '';
    this.removeConfirmId = null;
  }

  // All librarians not assigned to any branch (available to add)
  getAvailableLibrarians(): UserReadDto[] {
    const search = this.librarianSearch.toLowerCase();
    return this.allUsers.filter(u =>
      u.role === 'librarian' &&
      !u.branchId &&
      u.name.toLowerCase().includes(search)
    );
  }

  addLibrarian(user: UserReadDto): void {
    if (!this.librarianModalBranch) return;
    this.librarianSaving = true;
    const updatedUser: UserUpdateDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: null, // Password is not updated here
      role: user.role,
      imagePath: user.imagePath,
      employeeId: user.employeeId,
      branchId: this.librarianModalBranch.id
    };

    this.userService.updateItem(updatedUser).subscribe({
      next: () => {
        this.librarianSaving = false;
        this.loadAll();
        // Keep modal open but refresh — update local ref
        setTimeout(() => {
          this.librarianModalBranch = this.branches.find(b => b.id === this.librarianModalBranch?.id) ?? null;
        }, 300);
      },
      error: () => { this.librarianSaving = false; }
    });
  }

  requestRemoveLibrarian(userId: number): void {
    this.removeConfirmId = userId;
  }

  cancelRemoveLibrarian(): void {
    this.removeConfirmId = null;
  }

  confirmRemoveLibrarian(user: UserReadDto): void {
    this.librarianSaving = true;
    const updatedUser: UserUpdateDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: null,
      role: user.role,
      imagePath: user.imagePath,
      employeeId: user.employeeId,
      branchId: null
    };
    this.userService.updateItem(updatedUser).subscribe({
      next: () => {
        this.librarianSaving = false;
        this.removeConfirmId = null;
        this.loadAll();
      },
      error: () => { this.librarianSaving = false; this.removeConfirmId = null; }
    });
  }
}