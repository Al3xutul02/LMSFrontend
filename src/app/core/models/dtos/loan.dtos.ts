import { Dto, LoanStatus } from "../app.models";
import { BookRelationDto } from "./book.dtos";

export interface LoanCreateDto extends Dto {
    LoanerName: string;
    BookRelations?: BookRelationDto[];
}

export interface LoanReadDto extends Dto {
    Id: number;
    LoanerName: string;
    FineId?: number;
    IssueDate: Date;
    DueDate: Date;
    Status: LoanStatus;
    BookRelations?: BookRelationDto[];
}

export interface LoanUpdateDto extends Dto {
    Id: number;
    IssueDate: Date;
    DueDate: Date;
    Status: LoanStatus;
    BookRelations?: BookRelationDto[];
}