import { Dto } from "../app.models";
import { BookRelationDto } from "./book.dtos";

export interface BranchCreateDto extends Dto {
    Name: string;
    Address: string;
    IsOpen: boolean;
    BookRelations?: BookRelationDto[];
}

export interface BranchReadDto extends Dto {
    Id: number;
    Name: string;
    Address: string;
    IsOpen: boolean;
    EmployeeIds?: number[];
    BookRelations?: BookRelationDto[];
}

export interface BranchUpdateDto extends Dto {
    Id: number;
    Name: string;
    Address: string;
    IsOpen: boolean;
    BookRelations?: BookRelationDto[];
}