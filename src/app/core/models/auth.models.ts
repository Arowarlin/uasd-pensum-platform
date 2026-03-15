export type UserRole = 'admin' | 'estudiante';

export interface User {
  id: string;
  nombre: string;
  matricula: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginCredentials {
  matricula: string;
  password: string;
}