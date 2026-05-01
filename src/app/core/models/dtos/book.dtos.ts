import { BookGenre, BookStatus, Dto } from "../app.models";

export interface BookCreateDto extends Dto {
    isbn: number;
    title: string;
    author: string;
    description: string;
    genres?: BookGenre[];
    count: number;
    status: BookStatus;
}

export interface BookReadDto extends Dto {
    isbn: number;
    title: string;
    author: string;
    description: string;
    genres?: BookGenre[];
    count: number;
    status: BookStatus;
    branches?: string[];
    loanDurationDays?: number;
    canBeReserved?: boolean;
}

export interface BookUpdateDto extends Dto {
    isbn: number;
    title: string;
    author: string;
    description: string;
    genres?: BookGenre[];
    count: number;
    status: BookStatus;
}

export interface BookRelationDto extends Dto {
    isbn: number;
    count: number;
}