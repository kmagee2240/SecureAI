export interface AuthResponse {
  success: boolean;
  message: string;
  role?: string;
  token?: string;
  csrfToken?: string;
}
