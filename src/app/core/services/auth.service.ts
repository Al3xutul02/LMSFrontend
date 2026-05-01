import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { UserCreateDto } from "../models/dtos/user.dtos";
import { LoginDto, LoginResponseDto } from "../models/dtos/login.dtos";
import { Observable, throwError, of, firstValueFrom, switchMap } from 'rxjs';
import { tap, catchError } from "rxjs/operators";
import { UserRole } from "../models/app.models";
import { TokenPayload } from "../models/jwt-payload";

@Injectable({ providedIn: 'root'})
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    private webApiUrl: string = 'https://localhost:7076/auth';
    private tokenPayload: TokenPayload | null = null;

    readonly loggedIn = signal(false);

        isLoggedIn(): Promise<boolean> {
        const token = localStorage.getItem('token');
        if (!token) return Promise.resolve(false);

        const payload = this.decodeJwt(token);
        if (!payload) return Promise.resolve(false);

        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
            // Try to silently refresh instead of immediately logging out
            return firstValueFrom(
                this.refreshToken().pipe(
                    tap(() => this.loggedIn.set(true)),
                    switchMap(() => of(true)),
                    catchError(() => {
                        this.logout();
                        return of(false);
                    })
                )
            );
        }

        this.tokenPayload = payload;
        this.loggedIn.set(true);
        return Promise.resolve(true);
    }

    login(dto: LoginDto): Observable<LoginResponseDto> {
        return this.http.post<LoginResponseDto>(`${this.webApiUrl}/login`, dto).pipe(
            tap(response => this.handleAuthentication(response))
        );
    }

    register(dto: UserCreateDto): Observable<LoginResponseDto> {
        return this.http.post<LoginResponseDto>(`${this.webApiUrl}/register`, dto).pipe(
            tap(response => this.handleAuthentication(response))
        );
    }

    logout(): void {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        this.tokenPayload = null;
        this.loggedIn.set(false);
    }

    refreshToken(): Observable<LoginResponseDto> {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!token || !refreshToken) {
            return throwError(() => new Error('No tokens found.'));
        }

        return this.http.post<LoginResponseDto>(`${this.webApiUrl}/refresh-token`, 
            JSON.stringify(refreshToken),
            {
                headers: new HttpHeaders()
                    .set('Authorization', `Bearer ${token}`)
                    .set('Content-Type', 'application/json')
            }
        ).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
                this.tokenPayload = this.decodeJwt(response.token);
            })
        );
    }

    getUserRole(): UserRole {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found.');
        }

        if (this.tokenPayload) {
            return this.tokenPayload.role.toLowerCase() as UserRole;
        }

        throw new Error('User role not found.');
    }

    getUserName(): string {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found.');
        }

        if (this.tokenPayload) {
            return this.tokenPayload.name;
        }

        throw new Error('User name not found.');
    }

    getUserId(): number {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found.');
        }

        if (this.tokenPayload) {
            return Number(this.tokenPayload.id);
        }

        throw new Error('User ID not found.');
    }

    private handleAuthentication(response: LoginResponseDto) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.tokenPayload = this.decodeJwt(response.token);
        this.loggedIn.set(true);
    }

    private decodeJwt(token: string): TokenPayload | null {
        try {
            const payload = token.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
            const decoded = decodeURIComponent(
                atob(padded)
                    .split('')
                    .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                    .join('')
            );
            return JSON.parse(decoded) as TokenPayload;
        } catch (e) {
            return null;
        }
    }
}