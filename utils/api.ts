import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserCreate,
  LoginRequest,
  UserResponse,
  Token,
  PostResponse,
  PostListResponse,
  CreatePostRequest,
  ApiError,
} from '@/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://echo-api-90zm.onrender.com';
const TOKEN_STORAGE_KEY = '@echo_auth_token';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private async loadToken(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      this.token = token;
    } catch (error) {
      console.error('Failed to load token from storage:', error);
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      this.token = token;
    } catch (error) {
      console.error('Failed to save token to storage:', error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      this.token = null;
    } catch (error) {
      console.error('Failed to remove token from storage:', error);
    }
  }

  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: any = null;

      try {
        const errorData = await response.json();
        if (errorData.detail) {
          // Handle validation errors
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg).join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          }
          errorDetails = errorData.detail;
        }
      } catch {
        // If we can't parse the error response, use the default message
      }

      const apiError: ApiError = {
        message: errorMessage,
        status: response.status,
        details: errorDetails,
      };

      throw apiError;
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error('Failed to parse response JSON');
    }
  }

  // Authentication endpoints
  async register(userData: UserCreate): Promise<UserResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<UserResponse>(response);
  }

  async login(credentials: LoginRequest): Promise<Token> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(credentials),
    });

    const token = await this.handleResponse<Token>(response);
    await this.saveToken(token.access_token);
    return token;
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<UserResponse>(response);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const response = await fetch(`${this.baseUrl}/api/auth/users`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<UserResponse[]>(response);
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  // Posts endpoints
  async createPost(postData: CreatePostRequest): Promise<PostResponse> {
    const formData = new FormData();
    
    if (postData.text_content) {
      formData.append('text_content', postData.text_content);
    }
    
    if (postData.voice_file) {
      formData.append('voice_file', postData.voice_file);
    }

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/api/posts/`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<PostResponse>(response);
  }

  async getPosts(skip: number = 0, limit: number = 10): Promise<PostListResponse> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}/api/posts/?${params}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse<PostListResponse>(response);
  }

  async getMyPosts(skip: number = 0, limit: number = 10): Promise<PostListResponse> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}/api/posts/my-posts?${params}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<PostListResponse>(response);
  }

  async getPost(postId: number): Promise<PostResponse> {
    const response = await fetch(`${this.baseUrl}/api/posts/${postId}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse<PostResponse>(response);
  }

  async deletePost(postId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/posts/${postId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw await this.handleResponse(response);
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;