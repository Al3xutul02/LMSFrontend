export interface LoginDto {
    username: string;
    password: string;
}

export interface LoginResponseDto {
    token: string;
    refreshToken: string;
}