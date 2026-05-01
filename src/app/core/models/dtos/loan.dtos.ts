import { Dto, LoanStatus } from "../app.models";
import { BookRelationDto } from "./book.dtos";

export interface LoanCreateDto extends Dto {
    loanerName: string;
    bookRelations?: BookRelationDto[];
}

export interface LoanReadDto extends Dto {
    id: number;
    loanerName: string;
    fineId?: number;
    issueDate: Date;
    dueDate: Date;
    status: LoanStatus;
    bookRelations?: BookRelationDto[];
}

export interface LoanUpdateDto extends Dto {
    id: number;
    issueDate: Date;
    dueDate: Date;
    status: LoanStatus;
    bookRelations?: BookRelationDto[];
}