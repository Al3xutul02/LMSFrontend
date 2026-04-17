import { Dto } from "../app.models";
import { BookRelationDto } from "./book.dtos";

export interface BranchCreateDto extends Dto {
    name: string;
    address: string;
    isOpen: boolean;
    bookRelations?: BookRelationDto[];
}

export interface BranchReadDto extends Dto {
    id: number;
    name: string;
    address: string;
    isOpen: boolean;
    employeeIds?: number[];
    bookRelations?: BookRelationDto[];
}

export interface BranchUpdateDto extends Dto {
    id: number;
    name: string;
    address: string;
    isOpen: boolean;
    bookRelations?: BookRelationDto[];
}