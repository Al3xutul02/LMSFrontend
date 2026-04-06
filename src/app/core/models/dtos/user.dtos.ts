import { Dto, UserRole } from "../app.models";

export interface UserCreateDto extends Dto {
    Name: string;
    Email: string;
    Password: string;
    Role: UserRole;
}

export interface UserReadDto extends Dto {
    Id: number;
    Name: string;
    Email: string;
    Role: UserRole;
    EmployeeId?: number;
    BranchId?: number;
} 

export interface UserUpdateDto extends Dto {
    Id: number;
    Name: string;
    Email: string;
    Password: string;
}