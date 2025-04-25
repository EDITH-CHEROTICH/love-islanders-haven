
import api from './client';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      console.log('Auth API: Attempting login with', { email });
      const response = await api.post<AuthResponse>('/api/v1/auth/signin', {
        email,
        password,
      });
      console.log('Auth API: Login successful', response.data);
      return response.data;
    } catch (error) {
      console.error('Auth API: Login error', error);
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      console.log('Auth API: Attempting registration with', { email, name });
      const response = await api.post<UserProfile>('/api/v1/auth/signup', {
        email,
        password,
        name,
      });
      console.log('Auth API: Registration successful', response.data);
      return response.data;
    } catch (error) {
      console.error('Auth API: Registration error', error);
      throw error;
    }
  },

  verifyEmail: async (token: string) => {
    try {
      const response = await api.post<{ message: string }>('/api/v1/auth/verify-email', {
        token,
      });
      return response.data;
    } catch (error) {
      console.error('Auth API: Email verification error', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post<{ message: string }>('/api/v1/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Auth API: Logout error', error);
      throw error;
    }
  },
};
