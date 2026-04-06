import { BookGenre, BookStatus, Dto } from "../app.models";

export interface BookCreateDto extends Dto {
    ISBN: number;
    Title: string;
    Author: string;
    Description: string;
    Genres?: BookGenre[];
    Count: number;
    Status: BookStatus;
}

export interface BookReadDto extends Dto {
    ISBN: number;
    Title: string;
    Author: string;
    Description: string;
    Genres?: BookGenre[];
    Count: number;
    Status: BookStatus;
}

export interface BookUpdateDto extends Dto {
    ISBN: number;
    Title: string;
    Author: string;
    Description: string;
    Genres?: BookGenre[];
    Count: number;
    Status: BookStatus;
}

export interface BookRelationDto extends Dto {
    ISBN: number;
    Count: number;
}