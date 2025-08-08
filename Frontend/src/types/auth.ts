export interface User {
  id?: number; // SQL database ID
  _id?: string; // MongoDB ID (for backward compatibility)
  email: string;
  password: string;
  name: string;
  role: 'hr_manager' | 'admin' | 'viewer';
  department: string;
  employeeId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password'>;
  message?: string;
}

export interface AuthContextType {
  user: Omit<User, 'password'> | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}