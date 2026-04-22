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
    ISBN: number;
    Title: string;
    Author: string;
    Description: string;
    Genres?: BookGenre[];
    Count: number;
    Status: BookStatus;
    LoanDurationDays?: number;
    CanBeReserved?: boolean;
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