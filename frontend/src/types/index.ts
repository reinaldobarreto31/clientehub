export type StatusCliente = "ATIVO" | "INATIVO" | "PROSPECTO";

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  status: StatusCliente;
  createdAt: string;
  updatedAt: string;
}

export interface ClienteRequest {
  nome: string;
  email: string;
  telefone?: string;
  status: StatusCliente;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  nome: string;
  expiresIn: number;
}
