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

  isLoginMode = true; // Toggle state
  
  // Form fields
  username = '';
  password = '';
  confirmPassword = ''; // For Register
  email = ''; // For Register

  ngOnInit(): void {
    // Ckeck if user is already logged in and redirect, decomment once feed page is implemented
    //if (this.authService.isLoggedIn()) {
    //  this.router.navigate(['/feed']); // Redirect to feed if already logged in
    //}
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
      //next: () => this.router.navigate(['/feed']), // Once the feed page is implemented, change this to navigate there
      next: () => console.log('Login successful'),
      error: err => console.error('Login failed', err)
    });
  }

  private handleRegister(): void {
    const dto: UserCreateDto = { 
        name: this.username, 
        email: this.email, 
        password: this.password,
        role: 'reader'
    };

    if (this.password !== this.confirmPassword) {
        console.error('Passwords do not match');
        return;
    }

    this.authService.register(dto).subscribe({
      //next: () => this.router.navigate(['/feed']), // Once the feed page is implemented, change this to navigate there
      next: () => console.log('Registration successful'),
      error: err => console.error('Registration failed', err)
    });
  }
}