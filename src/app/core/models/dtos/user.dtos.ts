import { Dto, UserRole } from "../app.models";

export interface UserCreateDto extends Dto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserReadDto extends Dto {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    imagePath: string;
    employeeId: number | null;
    branchId: number | null;
} 

export interface UserUpdateDto extends Dto {
    id: number;
    name: string;
    email: string;
    password: string | null;
    imagePath: string;
    role: UserRole;
    employeeId: number | null;
    branchId: number | null;
}