// API types based on the provided OpenAPI schema
export interface UserCreate {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserResponse {
  username: string;
  id: number;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface PostResponse {
  text_content?: string | null;
  id: number;
  voice_file_path?: string | null;
  author: Record<string, any>;
  created_at: string;
  updated_at?: string | null;
}

export interface PostListResponse {
  posts: PostResponse[];
  total: number;
}

export interface CreatePostRequest {
  text_content?: string | null;
  voice_file?: File | null;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}