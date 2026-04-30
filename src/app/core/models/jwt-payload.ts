export interface TokenPayload {
  id: string;       // User ID
  name: string; // Username
  email: string;     // Email
  role: string;      // Role
  exp: number;       // Expiration
  iss: string;
  aud: string;
}