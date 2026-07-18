import type { User, ApiResponse } from '../types';
import { api, setAuthToken } from '../api/client';

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface OtpResponse {
  token: string;
}

class AuthService {
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const res = await api.post<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', { email, password });

    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Login failed' };
    }

    const { user, accessToken, refreshToken } = res.data;
    setAuthToken(accessToken);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone || '',
          avatar: user.avatar || '',
          isActive: user.isActive,
        } as User,
        token: accessToken,
        refreshToken,
      },
    };
  }

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<LoginResponse>> {
    const res = await api.post<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/register',
      {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role.toUpperCase(),
      }
    );

    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Registration failed' };
    }

    const { user, accessToken, refreshToken } = res.data;
    setAuthToken(accessToken);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone || '',
          avatar: user.avatar || '',
          isActive: user.isActive,
        } as User,
        token: accessToken,
        refreshToken,
      },
    };
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return api.post('/auth/reset-password', { token, password });
  }

  async sendOtp(email: string): Promise<ApiResponse> {
    return api.post('/auth/send-otp', { email });
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<OtpResponse>> {
    return api.post('/auth/verify-otp', { email, otp });
  }

  async refreshToken(token: string): Promise<ApiResponse<LoginResponse>> {
    const res = await api.post<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',
      { refreshToken: token }
    );

    if (!res.success || !res.data) {
      setAuthToken(null);
      return { success: false, error: res.error || 'Session expired' };
    }

    const { user, accessToken, refreshToken } = res.data;
    setAuthToken(accessToken);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone || '',
          avatar: user.avatar || '',
          isActive: user.isActive,
        } as User,
        token: accessToken,
        refreshToken,
      },
    };
  }

  async changePassword(
    _userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return api.post('/auth/change-password', {
      oldPassword: currentPassword,
      newPassword,
    });
  }

  async updateProfile(
    _userId: string,
    data: Partial<Pick<User, 'name' | 'email' | 'phone'>>
  ): Promise<ApiResponse<User>> {
    return api.put('/auth/profile', data);
  }

  async getProfile(_userId: string): Promise<ApiResponse<User>> {
    const res = await api.get<any>('/auth/profile');
    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Failed to fetch profile' };
    }
    const u = res.data;
    return {
      success: true,
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        phone: u.phone || '',
        avatar: u.avatar || '',
        isActive: u.isActive,
      } as User,
    };
  }
}

export const authService = new AuthService();
