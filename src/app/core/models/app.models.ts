export type UserRole = 'reader' | 'librarian' | 'administrator';
export type BookStatus = 'in-stock' | 'out-of-stock' | 'discontinued' | 'temporarily-unavailable';
export type LoanStatus = 'active' | 'overdue' | 'returned'|'pending';
export type FineStatus = 'paid' | 'unpaid' | 'waived';
export type BookGenre = 'action' | 'adventure' | 'art-and-photography' | 'biography' |
                        'children' | 'coming-of-age' | 'contemporary-fiction' | 'cook-books' |
                        'dystopian' | 'fantasy' | 'graphic-novel' | 'guide-or-how-to' |
                        'historical-fiction' | 'history' | 'horror' | 'humanities-and-social-sciences' |
                        'humor' | 'memoir' | 'mistery' | 'parenting-and-families' |
                        'philosophy' | 'religion-and-spirituality' | 'romance' | 'science-and-technology' |
                        'science-fiction' | 'self-help' | 'short-story' | 'thriller' |
                        'travel' | 'true-crime' | 'young-adult';

export interface Dto {}