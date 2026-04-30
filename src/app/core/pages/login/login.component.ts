import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { LoginDto } from "../../models/dtos/login.dtos";
import { UserCreateDto } from "../../models/dtos/user.dtos";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  username = '';
  password = '';
  confirmPassword = '';
  email = '';

  async ngOnInit(): Promise<void> {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/feed']);
    }
  }

  toggleMode(mode: boolean): void {
    this.isLoginMode = mode;
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin(): void {
    const dto: LoginDto = { username: this.username, password: this.password };
    this.authService.login(dto).subscribe({
      next: () => this.router.navigate(['/feed']),
      error: err => console.error('Login failed', err)
    });
  }

  private handleRegister(): void {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const dto: UserCreateDto = { 
      name: this.username, 
      email: this.email, 
      password: this.password,
      role: 'reader'
    };

    this.authService.register(dto).subscribe({
      next: () => this.router.navigate(['/feed']),
      error: err => console.error('Registration failed', err)
    });
  }
}