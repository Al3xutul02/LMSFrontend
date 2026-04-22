import { Dto, FineStatus } from "../app.models";

export interface FineCreateDto extends Dto {
    loanId: number;
    amount: number;
}

export interface FineReadDto extends Dto {
    id: number;
    loanId: number;
    amount: number;
    status: FineStatus;
}

export interface FineUpdateDto extends Dto{
    id: number;
    loanId: number;
    amount: number;
    status: FineStatus;
}