import { Dto, FineStatus } from "../app.models";

export interface FineCreateDto extends Dto {
    LoanId: number;
    Amount: number;
}

export interface FineReadDto extends Dto {
    Id: number;
    LoanId: number;
    Amount: number;
    Status: FineStatus;
}

export interface FineUpdateDto extends Dto{
    Id: number;
    LoanId: number;
    Amount: number;
    Status: FineStatus;
}