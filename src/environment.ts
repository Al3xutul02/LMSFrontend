export type ImageCategory = 'users' | 'books' | 'app';

interface AppEnvironment {
  production: boolean;
  webApiUrl: string;
  endpointMap: Record<string, string>;
  imagePaths: Record<ImageCategory, string>;
}

export const env: AppEnvironment = {
  production: true,
  webApiUrl: 'https://localhost:7076',
  endpointMap: {
    'book': 'book',
    'branch': 'branch',
    'fine': 'fine',
    'loan': 'loan',
    'user': 'user',
    'auth': 'auth'
  },
  imagePaths: {
    'users': 'assets/images/users',
    'books': 'assets/images/books',
    'app': 'assets/images/apps'
  }
};