export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  code: string;
  prompt?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Component {
  id: number;
  name: string;
  description?: string;
  code: string;
  prompt?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface GenerateRequest {
  prompt: string;
  existingCode?: string;
}

export interface GenerateResponse {
  code: string;
}
