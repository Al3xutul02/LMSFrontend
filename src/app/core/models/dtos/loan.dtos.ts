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

export interface RequestedBookDto extends Dto{
    title: string;
    author: string;
    availableCopies: number;
    requestedQuantity: number;
    status:LoanStatus;
}

export interface LoanDetailsDto extends Dto{
    requestId: number;
    requestDate:Date;
    returnDeadline:Date;
    userName: String;
    userEmail: String;
    userPhone: String; 
    userRole: String;
    activeLoansCount: number;
    requestedBooks?: RequestedBookDto[];
    overallStatus: String;
}
