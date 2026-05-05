import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserDataService } from "../../../services/data/user.data.service";
import { BranchDataService } from "../../../services/data/branch.data.service";
import { UserReadDto, UserCreateDto, UserUpdateDto } from "../../../models/dtos/user.dtos";
import { BranchReadDto } from "../../../models/dtos/branch.dtos";
import { UserRole } from "../../../models/app.models";

@Component({
  selector: 'users-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  allUsers: UserReadDto[] = [];
  branches: BranchReadDto[] = [];
  loading = true;
  error: string | null = null;

  expandedId: number | null = null;
  activeFilter: UserRole | 'all' = 'all';
  searchQuery = '';

  // Modal
  showModal = false;
  isEditMode = false;
  modalError: string | null = null;
  saving = false;
  form: {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    imagePath: string;
  } = { name: '', email: '', password: '', role: 'reader', imagePath: '' };

  // Delete confirm
  deleteConfirmId: number | null = null;

  readonly roles: (UserRole | 'all')[] = ['all', 'reader', 'librarian', 'administrator'];
  readonly selectableRoles: UserRole[] = ['reader', 'librarian', 'administrator'];

  constructor(
    private userService: UserDataService,
    private branchService: BranchDataService
  ) {}

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loading = true;
    this.error = null;
    this.userService.getItems().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.branchService.getItems().subscribe({
          next: (branches) => { this.branches = branches; this.loading = false; },
          error: () => { this.branches = []; this.loading = false; }
        });
      },
      error: () => { this.error = 'Failed to load users.'; this.loading = false; }
    });
  }

  get filteredUsers(): UserReadDto[] {
    return this.allUsers.filter(u => {
      const matchRole = this.activeFilter === 'all' || u.role === this.activeFilter;
      const matchSearch = u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }

  setFilter(role: UserRole | 'all'): void {
    this.activeFilter = role;
    this.expandedId = null;
    this.deleteConfirmId = null;
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
    this.deleteConfirmId = null;
  }

  getBranchName(branchId?: number): string {
    if (!branchId) return '—';
    return this.branches.find(b => b.id === branchId)?.name ?? '—';
  }

  roleLabel(role: UserRole | 'all'): string {
    return role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1);
  }

  roleBadgeClass(role: UserRole): string {
    return `role-badge role-${role}`;
  }

  countByRole(role: UserRole | 'all'): number {
    if (role === 'all') return this.allUsers.length;
    return this.allUsers.filter(u => u.role === role).length;
  }

  // ── Add / Edit ──
  openAdd(): void {
    this.isEditMode = false;
    this.form = { name: '', email: '', password: '', role: 'reader', imagePath: '' };
    this.modalError = null;
    this.showModal = true;
  }

  openEdit(user: UserReadDto, event: Event): void {
    event.stopPropagation();
    this.isEditMode = true;
    this.form = { id: user.id, name: user.name, email: user.email, password: '', role: user.role, imagePath: user.imagePath };
    this.modalError = null;
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; this.modalError = null; }

  saveModal(): void {
    if (!this.form.name.trim() || !this.form.email.trim()) {
      this.modalError = 'Name and email are required.';
      return;
    }
    if (!this.isEditMode && !this.form.password.trim()) {
      this.modalError = 'Password is required for new users.';
      return;
    }
    this.saving = true;
    this.modalError = null;

    if (this.isEditMode) {
      const dto: UserUpdateDto = {
        id: this.form.id!,
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        imagePath: this.form.imagePath
      };
      this.userService.updateItem(dto).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadAll(); },
        error: () => { this.saving = false; this.modalError = 'Failed to update user.'; }
      });
    } else {
      const dto: UserCreateDto = {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        role: this.form.role
      };
      this.userService.addItem(dto).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadAll(); },
        error: () => { this.saving = false; this.modalError = 'Failed to create user.'; }
      });
    }
  }

  // ── Delete ──
  requestDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.deleteConfirmId = id;
  }

  cancelDelete(): void { this.deleteConfirmId = null; }

  confirmDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.userService.deleteItem(id).subscribe({
      next: () => {
        this.deleteConfirmId = null;
        if (this.expandedId === id) this.expandedId = null;
        this.loadAll();
      },
      error: () => { this.deleteConfirmId = null; }
    });
  }
}