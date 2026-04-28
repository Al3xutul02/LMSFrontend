export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface BorrowRequestCreateDto {
  userId: number;
  bookISBN: number;
  count: number;
}

export interface BorrowRequestReadDto {
  id: number;
  requesterName: string;
  bookTitle: string;
  bookISBN: number;
  count: number;
  requestDate: Date;
  status: RequestStatus;
}