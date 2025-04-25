
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
      console.log('Auth API: Sending login request');
      const response = await api.post<AuthResponse>('/api/v1/auth/signin', {
        email,
        password,
      });
      console.log('Auth API: Login response received', response.status, response.statusText);
      return response.data;
    } catch (error) {
      console.error('Auth API: Login error', error);
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const response = await api.post<UserProfile>('/api/v1/auth/signup', {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error) {
      console.error('Auth API: Registration error', error);
      throw error;
    }
  },

  logout: async () => {
    const response = await api.post<{ message: string }>('/api/v1/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<UserProfile>('/api/v1/auth/me');
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await api.post<{ message: string }>('/api/v1/auth/reset-password/request', {
      email,
    });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post<{ message: string }>('/api/v1/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post<{ message: string }>('/api/v1/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post<{ message: string }>('/api/v1/auth/verify-email', {
      token,
    });
    return response.data;
  },
};
