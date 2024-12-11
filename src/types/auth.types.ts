export interface User {
  id: string;
  email: string;
  name?: string;
  profilePhoto: string | null;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
