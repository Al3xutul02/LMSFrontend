import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserCreateDto } from "../models/dtos/user.dtos";
import { LoginDto, LoginResponseDto } from "../models/dtos/login.dtos";
import { Observable, throwError, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root'})
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    private webApiUrl: string = 'https://localhost:7076/auth';

    isLoggedIn(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (token == null || token == undefined || token == '') return of(false);

        return this.http.get<boolean>(`${this.webApiUrl}/is-logged-in`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        }).pipe(
            catchError(() => of(false))
        );
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
    }

    refreshToken(): Observable<LoginResponseDto> {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!token || !refreshToken) {
            return throwError(() => new Error('No tokens found.'));
        }

        return this.http.get<LoginResponseDto>(`${this.webApiUrl}/refresh-token`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
            params: { refreshToken: refreshToken } 
        }).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
            })
        );
    }

    private handleAuthentication(response: LoginResponseDto) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
    }
}