import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserCreateDto } from "../models/dtos/user.dtos";
import { LoginDto, LoginResponseDto } from "../models/dtos/login.dtos";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class AuthService {
    protected http: HttpClient = inject(HttpClient);
    protected webApiUrl: string = 'https://localhost:7076/auth';

    isLoggedIn(): Observable<boolean> {
        if (!(!!localStorage.getItem('token'))) {
            return new Observable(observer => {
                observer.next(false);
                observer.complete();
            });
        }

        return this.http.get<boolean>(`${this.webApiUrl}/is-logged-in`,
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    }

    login(dto: LoginDto): void {
        this.http.post<LoginResponseDto>(`${this.webApiUrl}/login`, dto).subscribe({
            next: (response) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
            },
            error: (error) => {
                console.error('Login failed:', error);
                throw error;
            }
        });
    }

    logout(): void {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
    }

    register(dto: UserCreateDto): void {
        this.http.post<LoginResponseDto>(`${this.webApiUrl}/register`, dto).subscribe({
            next: (response) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
            },
            error: (error) => {
                console.error('Registration failed:', error);
                throw error;
            }
        });
    }

    refreshToken(): void {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.warn('No refresh token found. User may need to log in again.');
            return;
        }

        this.http.post<LoginResponseDto>(`${this.webApiUrl}/refresh-token`,
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, refreshToken }).subscribe({
            next: (response) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
            },
            error: (error) => {
                console.error('Token refresh failed:', error);
                throw error;
            }
        });
    }
}